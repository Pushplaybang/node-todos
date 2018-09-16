const _ = require('lodash');

const { User } = require('./../db/models/User');

class userController {
  register(req, res) {
    const body = _.pick(req.body, ['email', 'password']);
    const user = new User(body);

    return user
      .save()
      .then(() => user.generateAuthToken())
      .then((token) => {
        res.header('x-auth', token).send(user);
      })
      .catch(err => res.status(403).send({
        code: 403,
        message: 'there was an error registering the account',
        error: err,
      }));
  }

  login(req, res) {
    const body = _.pick(req.body, ['email', 'password']);

    return User.findByCredentials(body.email, body.password).then((user) => {
      return user.generateAuthToken().then((token) => {
        res.header('x-auth', token).send(user);
      });
    }).catch(err => res.status(err.code).send(err));
  }

  profile(req, res) {
    if (!req.user) {
      res.status(401).send();
    }
    res.send(req.user);
  }

  logout(req, res) {
    req.user.removeToken(req.token).then(() => {
      res.status(200).send();
    }, () => {
      res.status(400).send();
    });
  }
}

module.exports = userController;
