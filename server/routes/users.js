const _ = require('lodash');
const userRouter = require('express').Router({});

const { User } = require('./../db/models/User');
const { authenticate } = require('./../middleware/authenticate');

userRouter.post('/', (req, res) => {
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

userRouter.get('/me', authenticate, (req, res) => res.send(req.user));

userRouter.post('/login', (req, res) => {
  const body = _.pick(req.body, ['email', 'password']);

  return User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(400).send();
  });
});

userRouter.delete('/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});

module.exports = userRouter;
