const { pick } = require("ramda");
const {
  getLightsState,
  syncWithMosRuLightSchedule,
} = require("./components/light-schedule");
const analytics = require("./components/analytics");
const intentClassifier = require("./components/intent-classifier");
const buildStatement = require("./components/statement-builder");

const respond = async (requestBody, { text, tts }) => {
  await analytics.trackAgentMessage(requestBody, text);
  return {
    statusCode: 200,
    body: JSON.stringify({
      response: {
        text,
        tts,
        end_session: true,
      },
      session: pick(
        ["session_id", "message_id", "user_id"],
        requestBody.session
      ),
      version: requestBody.version,
    }),
  };
};

module.exports.main = async (event) => {
  const body = JSON.parse(event.body);
  const intent = intentClassifier(body.request["original_utterance"]);
  await analytics.trackUserMessage(body, intent);
  if (intent === null) {
    return respond(body, {
      text: "Не могу ответить.",
      tts: "не могу ответить",
    });
  }

  const lightState = await getLightsState();

  switch (intent) {
    case "ask-light-on-time":
      return await respond(
        body,
        buildStatement(
          lightState.isOn
            ? lightState.previousToggleTime
            : lightState.nextToggleTime,
          "on",
          body.meta.timezone
        )
      );
    case "ask-light-off-time":
      return await respond(
        body,
        buildStatement(
          lightState.isOn
            ? lightState.nextToggleTime
            : lightState.previousToggleTime,
          "off",
          body.meta.timezone
        )
      );
  }
};

module.exports.recache = async (event) => {
  console.log("Start refreshing cache");
  await syncWithMosRuLightSchedule();
  console.log("Done");
};
