const chatbase = require("@google/chatbase");
const pkg = require("../../package.json");

module.exports = {
  async trackUserMessage(requestBody, intent) {
    const msg = chatbase
      .newMessage(process.env.chatbaseKey, requestBody.session["user_id"])
      .setAsTypeUser()
      .setPlatform(requestBody.meta["client_id"])
      .setMessage(requestBody.request["original_utterance"])
      .setVersion(pkg.version)
      .setCustomSessionId(requestBody.session["session_id"])
      .setMessageId(requestBody.session["message_id"]);
    if (intent !== null) {
      msg.setIntent(intent).setAsHandled();
    } else {
      msg.setAsNotHandled();
    }
    await msg.send();
  },

  async trackAgentMessage(requestBody, responseText) {
    await chatbase
      .newMessage(process.env.chatbaseKey, requestBody.session["user_id"])
      .setAsTypeAgent()
      .setPlatform(requestBody.meta["client_id"])
      .setMessage(responseText)
      .setVersion(pkg.version)
      .setCustomSessionId(requestBody.session["session_id"])
      .setMessageId(requestBody.session["message_id"] + "reply")
      .send();
  },
};
