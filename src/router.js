const express = require('express');
const router = express.Router();

const logger = require('./logger');
const checkToken = require('./token');
const oai = require('./openai');

// middleware that is specific to this router
// router.use((req, res, next) => {
//   console.log(`${req.method}\t ${req.url}`, req.body);
//   if (!checkToken(req)) {
//     const response = { error: 'Invalid token.' };
//     logger.log(req, response);
//     return res.json(response);
//   }

//   if (req.url !== '/log') logger.log(req);

//   next();
// });

router.post('/ask', async (req, res, next) => {
  if (!checkToken(req)) {
    const response = { error: 'Invalid token.' };
    logger.log(req, response);
    return res.json(response);
  }

  const options = oai.parseOptions(req.body);

  if (!options.prompt) res.json({ error: 'No prompt provided.' });
  if (options.prompt.length < 10)
    res.json({ error: 'Prompt must be at least 10 characters long.' });

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

router.get('/log', (req, res) => {
  const log = logger.getLog();
  res.json(log);
});

router.get('/', (req, res) => {
  res.send('Hello World! ' + process.env.APP_NAME);
});

module.exports = router;
