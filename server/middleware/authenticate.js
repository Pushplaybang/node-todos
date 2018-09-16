const { User } = require('./../db/models/User');

const authenticate = (req, res, next) => {
  const token = req.header('x-auth');

  return User.findByToken(token)
    .then((user) => {
      if (!user) {
        return Promise.reject();
      }

      req.user = user;
      req.token = token;
      return next();
    })
    .catch(err => res.status(401).send({
      code: 401,
      error: {},
      message: 'not authenticated'
    }));
};

module.exports = {
  authenticate,
};
