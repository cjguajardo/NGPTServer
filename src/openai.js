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

const parseOptions = (body = {}) => {
  const options = {};
  const {
    model,
    prompt,
    temperature,
    max_tokens,
    top_p,
    frequency_penalty,
    presence_penalty,
    stop,
  } = body;

  if (model) options.model = model;
  if (prompt) options.prompt = prompt;
  if (temperature) options.temperature = parseFloat(temperature);
  if (max_tokens) options.max_tokens = parseInt(max_tokens);
  if (top_p) options.top_p = parseInt(top_p);
  if (frequency_penalty)
    options.frequency_penalty = parseFloat(frequency_penalty);
  if (presence_penalty) options.presence_penalty = parseFloat(presence_penalty);
  if (stop) options.stop = stop;

  return options;
};

module.exports = { getAnswer, parseOptions };
