const test = require("ava");
const Axios = require("axios");
const axios = Axios.create({
  baseURL: "https://l0efcraswa.execute-api.eu-central-1.amazonaws.com/staging/",
});
const testPhrases = require("./test-phrases.json");
const requestBody = require("./example-request.json");

test("Handles all implicit invocation phrases", async (t) => {
  for (const testPhrase of testPhrases) {
    requestBody.request["original_utterance"] = testPhrase;
    const response = await axios.post("main", requestBody);
    console.log(testPhrase);
    console.log("├── text:", response.data.response.text);
    console.log("└── tts:", response.data.response.tts);
  }
  t.pass();
});

test("Handles unrecognized intents with userfriendy message", async (t) => {
  requestBody.request["original_utterance"] = "Сколько месяцев в году?";
  const response = await axios.post("main", requestBody);
  t.true(response.data.response.text === "Не могу ответить.");
});
