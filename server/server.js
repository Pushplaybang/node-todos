require('./config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

const { mongoose } = require('./db/mongoose');

const { Todo } = require('./db/models/Todo');
const { User } = require('./db/models/User');

const { authenticate } = require('./middleware/authenticate');

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

/**
 * TODO Routes
 */

app.post('/todos', authenticate, (req, res) => {
  const todo = new Todo({
    text: req.body.text,
    _creator: req.user._id,
  });

  todo
    .save()
    .then((doc) => {
      res.send(doc);
    })
    .catch(err => res.status(400).send(err));
});

app.get('/todos', authenticate, (req, res) => {
  Todo.find({
      _creator: req.user._id,
    })
    .then(todos => res.send({ todos }))
    .catch(err => res.status(400).send(err));
});

app.get('/todos/:id', authenticate, (req, res) => {
  const { id } = req.params;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findOne({
    _id: id,
    _creator: req.user._id,
  }).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    return res.send({ todo });
  })
    .catch(err => res.status(400).send(err));
});

app.patch('/todos/:id', authenticate, (req, res) => {
  const { id } = req.params;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  const body = _.pick(req.body, ['text', 'completed']);

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = Date.now();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findOneAndUpdate({
      _id: id,
      _creator: req.user._id,
    }, { $set: body }, { new: true })
    .then((todo) => {
      if (!todo) {
        return res.status(404).send();
      }

      return res.send({ todo });
    })
    .catch(err => res.status(400).send(err));
});

app.delete('/todos/:id', authenticate, (req, res) => {
  const { id } = req.params;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  return Todo.findOneAndRemove({
    _id: id,
    _creator: req.user._id,
  })
    .then((todo) => {
      if (!todo) {
        return res.status(404).send();
      }

      return res.send({ todo });
    })
    .catch(err => res.status(400).send(err));
});

/**
 * User Routes
 */

app.post('/users', (req, res) => {
  const body = _.pick(req.body, ['email', 'password']);
  const user = new User(body);

  user
    .save()
    .then(() => user.generateAuthToken())
    .then((token) => {
      res.header('x-auth', token).send(user);
    })
    .catch(err => res.status(400).send(err));
});

app.get('/users/me', authenticate, (req, res) => res.send(req.user));

app.post('/users/login', (req, res) => {
  const body = _.pick(req.body, ['email', 'password']);

  return User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(400).send();
  });
});

app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});


app.listen(port, () => {
  console.log(`api started running on ${port}`); // eslint-disable-line
});

module.exports = { app };
