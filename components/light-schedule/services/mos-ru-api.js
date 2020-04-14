const Axios = require("axios");

const axios = Axios.create({ baseURL: "https://apidata.mos.ru/v1/" });

async function fetchLightSchedule() {
  return (
    await axios.get("/datasets/3288/rows", {
      params: { api_key: process.env.mosRuAPIKey },
    })
  ).data;
}

module.exports = {
  fetchLightSchedule,
};
