const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORGANIZATION,
});

const getAnswer = async (options = {}) => {
  const openai = new OpenAIApi(configuration);
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: options.prompt,
    temperature: 0.7,
    max_tokens: 60,

    ...options,
  });

  return response.data.choices;
};

module.exports = { getAnswer };
