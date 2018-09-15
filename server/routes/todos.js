
const _ = require('lodash');
const todoRouter = require('express').Router({});

const { ObjectID } = require('mongodb');

const { Todo } = require('./../db/models/Todo');
const { authenticate } = require('./../middleware/authenticate');

todoRouter.post('', authenticate, (req, res) => {
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

todoRouter.get('', authenticate, (req, res) => {
  Todo.find({
      _creator: req.user._id,
    })
    .then(todos => res.send({ todos }))
    .catch(err => res.status(400).send(err));
});

todoRouter.get('/:id', authenticate, (req, res) => {
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

todoRouter.patch('/:id', authenticate, (req, res) => {
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

todoRouter.delete('/:id', authenticate, (req, res) => {
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

module.exports = todoRouter;