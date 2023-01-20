const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORGANIZATION,
});

const getAnswer = async (question, options = {}) => {
  const openai = new OpenAIApi(configuration);
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: question,
    // temperature: 0.8,
    // max_tokens: 100,
    // top_p:1,
    // frequency_penalty:0.0,
    // presence_penalty:0.0,
    // stop: ["\n"],
    // logprobs: 2,
    ...options,
  });

  return response.data.choices;
};

module.exports = { getAnswer };
