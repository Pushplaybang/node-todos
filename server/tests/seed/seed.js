const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

const { Todo } = require('./../../db/models/Todo');
const { User } = require('./../../db/models/User');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const initUsers = [{
  _id: userOneId,
  email: 'andrew@example.com',
  password: 'userOnePass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({ _id: userOneId, access: 'auth' }, 'supersecret').toString(),
  }],
}, {
  _id: userTwoId,
  email: 'jen@example.com',
  password: 'userTwoPass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({ _id: userTwoId, access: 'auth' }, 'supersecret').toString(),
  }],
}];

const initTodos = [{
  _id: new ObjectID(),
  text: 'First test todo',
  _creator: userOneId,
}, {
  _id: new ObjectID(),
  text: 'Second test todo',
  completed: true,
  completedAt: 333,
  _creator: userTwoId,
}];

const populateTodos = (done) => {
  Todo.remove({})
    .then(() => Todo.insertMany(initTodos))
    .then(() => done());
};

const populateUsers = (done) => {
  User.remove({}).then(() => {
    const userOne = new User(initUsers[0]).save();
    const userTwo = new User(initUsers[1]).save();

    return Promise.all([userOne, userTwo])
  }).then(() => done());
};

module.exports = {
  initTodos,
  populateTodos,
  initUsers,
  populateUsers,
};
