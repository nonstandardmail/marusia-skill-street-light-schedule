const bb = require("bluebird");
const R = require("ramda");
const moment = require("moment-timezone");
const s3Cache = require("../services/s3-cache");
const mosRuAPI = require("../services/mos-ru-api");

module.exports = class LightSchedule {
  constructor() {
    this.events = [];
    this.s3CacheKey = "light-schedule-events";
  }

  async loadEvents() {
    let events = R.map(
      (event) => Object.assign(event, { datetime: moment(event.datetime) }),
      await s3Cache.read(this.s3CacheKey)
    );
    if (events !== null) {
      this.events = events;
    } else {
      await this.syncWithMosRuLightSchedule();
    }
  }

  async syncWithMosRuLightSchedule() {
    this.events = this.normalizeMosRuLightSchedule(
      await mosRuAPI.fetchLightSchedule()
    );
    await s3Cache.write(this.s3CacheKey, this.events);
  }

  normalizeMosRuLightSchedule(mosRuLightSchedule) {
    let events = [];
    for (const daySchedule of mosRuLightSchedule) {
      const [_, day, month, year] = daySchedule["Cells"]["Date"].match(
        /(\d+).(\d+).(\d+)/
      );
      events = events.concat(
        R.map(
          (eventType) => ({
            datetime: moment
              .tz(
                `${year}-${month}-${day} ${
                  daySchedule["Cells"][
                    eventType === "on" ? "OnTime" : "OffTime"
                  ]
                }`,
                "Europe/Moscow"
              )
              .utc(),
            type: eventType,
          }),
          ["on", "off"]
        )
      );
    }
    return R.sortBy(R.prop("datetime"), events);
  }

  async getLightsState() {
    if (this.events.length === 0) await this.loadEvents();
    const eventDidNotOccureYet = R.pipe(R.prop("datetime"), R.lte(new Date()));
    const upcomingEventIndex = R.findIndex(eventDidNotOccureYet, this.events);
    const upcomingEvent = this.events[upcomingEventIndex];
    const lastOccuredEvent = this.events[upcomingEventIndex - 1];
    return {
      isOn: lastOccuredEvent.type === "on",
      nextToggleTime: upcomingEvent.datetime.utc().format(),
      previousToggleTime: lastOccuredEvent.datetime.utc().format(),
    };
  }

  async save(events) {
    return bb.resolve(events).mapSeries((lightScheduleEvent) =>
      dynamoDB
        .putItem({
          TableName: this.persistanceTableName,
          Item: marshall(lightScheduleEvent),
        })
        .promise()
    );
  }

  async isLightsOn() {}
};
