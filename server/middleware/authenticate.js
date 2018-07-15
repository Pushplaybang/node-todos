const { User } = require('./../db/models/User');

const authenticate = (req, res, next) => {
  const token = req.header('x-auth');

  return User.findByToken(token)
    .then((user) => {
      if (!user) {
        return res.status(404).send();
      }

      req.user = user;
      req.token = token;
      return next();
    })
    .catch(err => res.status(401).send(err));
};

module.exports = {
  authenticate,
};
