const express = require('express');
const router = require('./router');

const app = express();

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use('/api/', router);

app.listen(3000, () => {
  console.log('El servidor está inicializado en el puerto 3000');
});
