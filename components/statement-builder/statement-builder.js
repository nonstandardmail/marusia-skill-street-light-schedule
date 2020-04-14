const moment = require("moment-timezone");
moment.locale("ru");

const humanizeTimeToDate = (isoDateString) => moment(isoDateString).fromNow();

const formatAsHHMM = (isoDateString, timezone) =>
  moment.tz(isoDateString, timezone).format("HH:mm");

module.exports = (isoDateString, toggleType, timezone) => {
  const alreadyToggled = moment().diff(moment(isoDateString)) > 0;
  if (alreadyToggled) {
    return {
      text: `Освещение уже ${
        toggleType === "on" ? "включили" : "выключили"
      } ${humanizeTimeToDate(isoDateString)}. В ${formatAsHHMM(
        isoDateString,
        timezone
      )}.`,
      tts: `Освещение уже ${
        toggleType === "on" ? "включили" : "выключили"
      } ${humanizeTimeToDate(isoDateString)}. В ${formatAsHHMM(
        isoDateString,
        timezone
      )}.`,
    };
  } else {
    return {
      text: `Освещение ${
        toggleType === "on" ? "включат" : "выключат"
      } ${humanizeTimeToDate(isoDateString)}. В ${formatAsHHMM(
        isoDateString,
        timezone
      )}.`,
      tts: `${humanizeTimeToDate(isoDateString)}. В ${formatAsHHMM(
        isoDateString,
        timezone
      )}.`,
    };
  }
};
