const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const logger = require('./logger');
const checkToken = require('./token');
const oai = require('./openai');

var router = express.Router();

router.use(function (req, res, next) {
  console.log(`${req.method}\t ${req.url}`, req.body);
  if (!checkToken(req)) {
    const response = { error: 'Invalid token.' };
    logger.log(req, response);
    return res.json(response);
  }

  if (req.url !== '/log') logger.log(req);

  next();
});

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(router);

app.post('/ask', async (req, res, next) => {
  const options = oai.parseOptions(req.body);

  if (!options.prompt) throw new Error('Prompt is required.');
  if (options.prompt.length < 10)
    throw new Error('Prompt must be at least 10 characters long.');

  try {
    const answer = await oai.getAnswer(options);

    console.log({ options, answer });

    if (!answer || !answer[0] || !answer[0].text)
      throw new Error('No answer found.');

    res.json({ answer });
  } catch (e) {
    console.error(e);
    next(e);
  }
});

app.get('/cfg', (req, res) => {
  try {
    const { PORT, APP_NAME, AUTH_TOKEN } = process.env;
    res.json({
      PORT,
      APP_NAME,
      AUTH_TOKEN,
    });
  } catch (e) {
    console.log(e);
    res.json({ error: e });
  }
});

app.get('/', (req, res) => {
  res.send('Hello World!' + process.env.APP_NAME);
});

app.get('/log', (req, res) => {
  const log = logger.getLog();
  res.json(log);
});

app.listen(3000, () => {
  console.log('El servidor está inicializado en el puerto 3000');
});
