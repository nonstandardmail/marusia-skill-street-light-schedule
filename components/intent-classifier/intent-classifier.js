const intents = [
  /* Когда в Москве (включат|включают|врубают|врубят|зажгут|зажигают) (свет|освещение|наружное освещение|наружку) */
  {
    name: "ask-light-on-time",
    matches: (utterance) => /включа|зажгут|зажигают|вруб/.test(utterance),
  },
  /* Когда в Москве (выключат|вырубят|вырубают|отключают|отключат|тушат|потушат) (свет|освещение|наружное освещение|наружку) */
  {
    name: "ask-light-off-time",
    matches: (utterance) => /выключа|отключа|тушат|выруб/.test(utterance),
  },
];

module.exports = (utterance) => {
  for (const intent of intents)
    if (intent.matches(utterance)) return intent.name;
  return null;
};
