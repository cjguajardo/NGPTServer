const express = require('express');
const router = express.Router();

const logger = require('./logger');
const checkToken = require('./token');
const oai = require('./openai');

/**
 *  Express middleware function that logs the request method, URL, and body, and checks for a valid token.
 *  @function
 *  @param {Object} req - Express request object
 *  @param {Object} res - Express response object
 *  @param {function} next - Express next middleware function
 */
router.use((req, res, next) => {
  console.log(`${req.method}\t ${req.url}`, req.body);
  if (!checkToken(req)) {
    const response = { error: 'Invalid token.' };
    logger.log(req, response);
    return res.json(response);
  }

  if (req.url !== '/log') logger.log(req);

  next();
});

/**
 *
 * @function
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {function} next - Express next middleware function
 * Handles a POST request to the '/ask' route. Parses options from the body, checks for a valid prompt, and uses the OpenAI API to generate an answer.
 * Available options:
 *  - model {string} - The model to use for generating the answer
 *  - prompt {string} - The prompt to use for generating the answer
 *  - temperature {number} - The temperature to use for generating the answer
 *  - max_tokens {number} - The maximum number of tokens to use for generating the answer
 *  - top_p {number} - The top_p value to use for generating the answer
 *  - frequency_penalty {number} - The frequency_penalty value to use for generating the answer
 *  - presence_penalty {number} - The presence_penalty value to use for generating the answer
 *  - stop {string} - The stop string to use for generating the answer
 */
router.post('/ask', async (req, res, next) => {
  const options = oai.parseOptions(req.body);
  // Check if prompt is provided
  if (!options.prompt) return res.json({ error: 'No prompt provided.' });

  // Check if prompt is at least 10 characters long
  if (options.prompt.length < 10)
    return res.json({ error: 'Prompt must be at least 10 characters long.' });

  // Check if prompt is a base64 encoded string
  if (
    options.prompt.length % 4 === 0 &&
    options.prompt.match(/^[a-zA-Z0-9+/]+={0,3}$/)
  ) {
    try {
      options.prompt = Buffer.from(options.prompt, 'base64').toString('ascii');
    } catch (e) {
      console.error(e);
      return next(e);
    }
  }

  try {
    const answer = await oai.getAnswer(options);
    if (!answer || !answer[0] || !answer[0].text)
      throw new Error('No answer found.');
    return res.json({ answer });
  } catch (e) {
    console.error(e);
    return next(e);
  }
});

/**
 *
 * @function
 * @param {string} '/log' - endpoint for the GET request
 * @param {function} (req, res) - callback function to handle the GET request
 * @returns {Object} - JSON object containing the log from the logger module
 */
router.get('/log', (req, res) => {
  const log = logger.getLog();
  res.json(log);
});

/**
 *
 * @function
 * @param {string} '/' - endpoint for the GET request
 * @param {function} (req, res) - callback function to handle the GET request
 * @returns {string} - a message with the greeting and the app name from the environment variable
 */
router.get('/', (req, res) => {
  res.json(`Up and running ${process.env.APP_NAME}!!`.toUpperCase());
});

module.exports = router;
