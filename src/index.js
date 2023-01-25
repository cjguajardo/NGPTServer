const express = require('express');
const bodyParser = require('body-parser');
const router = require('./router');

const app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use('/api/', router);

app.listen(3000, () => {
  console.log('El servidor está inicializado en el puerto 3000');
});
