const express = require('express');
const bodyParser = require('body-parser');

const { mongoose } = require('./db/mongoose.js');
const { Todo } = require('./db/models/Todo');
const { User } = require('./db/models/User');

const app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  const todo = new Todo({ text: req.body.text });
  todo
    .save()
    .then((doc) => {
      res.send(doc);
    })
    .catch(err => res.status(400).send(err));
});

app.get('/todos', (req, res) => {
  console.log(req);
});

app.get('/todos/:id', (req, res) => {
  console.log(req);
});

app.put('/todos/:id', (req, res) => {
  console.log(req);
});

app.delete('/todos/:id', (req, res) => {
  console.log(req);
});

app.listen(3000, () => {
  console.log('api strarted running');
});

module.exports = { app };
