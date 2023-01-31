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

const getImage = async (options = {}) => {
  const openai = new OpenAIApi(configuration);
  const response = await openai.createImage({
    ...options,
  });

  return response.data;
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

const parseImageOptions = (body = {}) => {
  const options = {};
  const { prompt, size, response_format, user } = body;

  if (prompt) options.prompt = prompt;
  if (size) options.size = size;
  if (response_format) options.response_format = response_format;
  if (user) options.user = user;

  if (options.prompt && options.prompt.length < 10)
    return { error: 'Prompt must be at least 10 characters long.' };
  if (['256x256', '512x512', '1024x1024'].indexOf(options.size) === -1)
    return { error: 'Size must be 256x256, 512x512, or 1024x1024.' };
  if (['url', 'b64_json'].indexOf(options.response_format) === -1)
    return { error: 'Response format must be url or b64_json.' };

  return options;
};

module.exports = { getAnswer, getImage, parseOptions, parseImageOptions };
