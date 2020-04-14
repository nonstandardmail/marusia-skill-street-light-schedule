const LightSchedule = require("./models/light-schedule");

const lightSchedule = new LightSchedule();

module.exports = {
  getLightsState: lightSchedule.getLightsState.bind(lightSchedule),
  syncWithMosRuLightSchedule: lightSchedule.syncWithMosRuLightSchedule.bind(
    lightSchedule
  ),
};
