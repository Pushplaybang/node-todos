const userRouter = require('express').Router({});

const UserController = require('./../controllers/users');
const { authenticate } = require('./../middleware/authenticate');

const controller = new UserController();

userRouter.post('/', controller.register);
userRouter.post('/login', controller.login);
userRouter.get('/me', authenticate, controller.profile);
userRouter.delete('/me/token', authenticate, controller.logout);

module.exports = userRouter;
