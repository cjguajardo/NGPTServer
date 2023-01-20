const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer'); // v1.0.5
const upload = multer(); // for parsing multipart/form-data
const app = express();
const checkToken = require('./token');

const AUTH_TOKEN = process.env.AUTH_TOKEN;

const oai = require('./openai');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.post('/ask2IA', upload.array(), async (req, res, next) => {
  //from req get text={string}
  //return {id: string, type: string, text: string}

  if (!checkToken(req)) return res.json({ error: 'Invalid token.' });

  try {
    const {
      model,
      prompt,
      temperature,
      max_tokens,
      top_p,
      frequency_penalty,
      presence_penalty,
      stop,
      logprobs,
    } = req.body;

    const options = {};

    if (model) options.model = model;
    if (prompt) options.prompt = prompt;
    if (temperature) options.temperature = parseFloat(temperature);
    if (max_tokens) options.max_tokens = parseInt(max_tokens);
    if (top_p) options.top_p = parseInt(top_p);
    if (frequency_penalty)
      options.frequency_penalty = parseFloat(frequency_penalty);
    if (presence_penalty)
      options.presence_penalty = parseFloat(presence_penalty);
    if (stop) options.stop = stop;
    if (logprobs) options.logprobs = parseInt(logprobs);

    if (!options.prompt) throw new Error('Prompt is required.');
    if (options.prompt.length < 10)
      throw new Error('Prompt must be at least 10 characters long.');

    const answer = await oai.getAnswer(options);

    console.log({ options, answer });

    if (!answer || !answer[0] || !answer[0].text)
      throw new Error('No answer found.');

    res.json({ answer });
  } catch (e) {
    console.log(e);
    res.json({ error: e });
  }
});

app.get('/getCfg', (req, res, next) => {
  if (!checkToken(req)) return res.json({ error: 'Invalid token.' });
  try {
    const { PORT, APP_NAME, OPENAI_API_KEY, OPENAI_ORGANIZATION, AUTH_TOKEN } =
      process.env;
    res.json({
      PORT,
      APP_NAME,
      OPENAI_API_KEY,
      OPENAI_ORGANIZATION,
      AUTH_TOKEN,
    });
  } catch (e) {
    console.log(e);
    res.json({ error: e });
  }
});

app.get('/', (req, res, next) => {
  res.json({ message: 'Hello World!' });
});

app.listen(3000, () => {
  console.log('El servidor está inicializado en el puerto 3000');
});
