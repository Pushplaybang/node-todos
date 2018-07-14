const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

const { mongoose } = require('./db/mongoose');
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
  Todo.find()
    .then(todos => res.send({ todos }))
    .catch(err => res.status(400).send(err));
});

app.get('/todos/:id', (req, res) => {
  const { id } = req.params;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findById(id)
    .then((todo) => {
      if (!todo) {
        return res.status(404).send();
      }

      return res.send({ todo });
    })
    .catch(err => res.status(400).send(err));
});

app.put('/todos/:id', (req, res) => {
  Todo.update()
    .then((todo) => {
      if (!todo) {
        return res.status(404).send();
      }

      return res.send({ todo });
    })
    .catch(err => res.status(400).send(err));
});

app.delete('/todos/:id', (req, res) => {
  Todo.remove()
    .then(todos => res.send())
    .catch(err => res.status(400).send(err));
});

app.listen(3000, () => {
  console.log('api strarted running');
});

module.exports = { app };
