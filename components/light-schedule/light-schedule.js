const LightChedule = require("./models/light-schedule");

const lightChedule = new LightChedule();

module.exports = {
  getLightsState: lightChedule.getLightsState.bind(lightChedule),
};
