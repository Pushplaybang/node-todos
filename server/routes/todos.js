const todoRouter = require('express').Router({});

const TodoController = require('./../controllers/todos');
const { authenticate } = require('./../middleware/authenticate');

const controller = new TodoController();

todoRouter.post('/', authenticate, controller.create);
todoRouter.get('/', authenticate, controller.list);
todoRouter.get('/:id', authenticate, controller.single);
todoRouter.patch('/:id', authenticate, controller.update);
todoRouter.delete('/:id', authenticate, controller.delete);

module.exports = todoRouter;
