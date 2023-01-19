const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer"); // v1.0.5
const upload = multer(); // for parsing multipart/form-data
const app = express();
require("dotenv").config();

const oai = require("./openai");

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.post("/api/input", upload.array(), async (req, res, next) => {
  //from req get type={string}:Answer|Question, text={string}, parent={string|null}
  //if type=Answer, then get parent={string} and add to parent's children
  //if type=Question, then create new node with text={string} and parent={string|null}
  //return {id: string, type: string, text: string, parent: string|null, children: string[]}

  const { text, type, parent, options } = req.body;

  const answer = await oai.getAnswer(text, options);

  console.log({ text, type, parent, answer });

  res.json(answer);
});

app.listen(3000, () => {
  console.log("El servidor está inicializado en el puerto 3000");
  //  console.log({OPENAI_API_KEY: process.env.OPENAI_API_KEY})
});
