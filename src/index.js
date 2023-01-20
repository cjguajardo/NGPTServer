const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer'); // v1.0.5
const upload = multer(); // for parsing multipart/form-data
const app = express();
require('dotenv').config();

const oai = require('./openai');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.post('/api/input', upload.array(), async (req, res, next) => {
  //from req get type={string}:Answer|Question, text={string}, parent={string|null}
  //if type=Answer, then get parent={string} and add to parent's children
  //if type=Question, then create new node with text={string} and parent={string|null}
  //return {id: string, type: string, text: string}

  try {
    const { text, options } = req.body;

    const answer = await oai.getAnswer(text, options);

    console.log({ text, answer });

    res.json(answer);
  } catch (e) {
    console.log(e);
    res.json({ error: e });
  }
});

app.listen(3000, () => {
  console.log('El servidor está inicializado en el puerto 3000');
});
