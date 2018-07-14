const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../db/models/Todo');

/* global beforeEach describe it */
const initTodos = [
  {
    _id: new ObjectID(),
    text: 'First test todo',
  },
  {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 666,
  },
];

beforeEach((done) => {
  Todo.remove({})
    .then(() => Todo.insertMany(initTodos))
    .then(() => done());
});

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    const text = 'test todo text';

    request(app)
      .post('/todos')
      .send({ text })
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({ text: 'test todo text' })
          .then((todos) => {
            expect(todos.length).toBe(1);
            expect(todos[0].text).toBe(text);
            done();
          })
          .catch(e => done(e));
      });
  });

  it('should not create a todo with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err) => {
        if (err) {
          return done(err);
        }

        Todo.find()
          .then((todos) => {
            expect(todos.length).toBe(2);
            done();
          })
          .catch(e => done(e));
      });
  });
});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect(res => expect(res.body.todos.length).toBe(2))
      .end(done);
  });
});

describe('GET todos/:id', () => {
  it('should get a specific todo by id', (done) => {
    request(app)
      .get(`/todos/${initTodos[0]._id.toHexString()}`)
      .expect(200)
      .expect(res => expect(res.body.todo.text).toBe(initTodos[0].text))
      .end(done);
  });

  it('should return 404 for non ObjectId', (done) => {
    request(app)
      .get(`/todos/${123}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 for if todo not found', (done) => {
    request(app)
      .get(`/todos/${new ObjectID().toHexString()}`)
      .expect(404)
      .end(done);
  });
});

describe('PATCH todos/:id', () => {
  it('should update a specific todo by id', (done) => {
    const newBody = {
      text: 'new todo text',
      completed: true,
    };

    request(app)
      .patch(`/todos/${initTodos[0]._id.toHexString()}`)
      .send(newBody)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(newBody.text);
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeA('number');
      })
      .end(done);
  });

  it('should update complete to false', (done) => {
    const newBody = {
      completed: false,
    };

    request(app)
      .patch(`/todos/${initTodos[1]._id.toHexString()}`)
      .send(newBody)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toBe(null);
      })
      .end(done);
  });

  it('should return 404 for non ObjectId', (done) => {
    request(app)
      .patch('/todos/12344')
      .expect(404)
      .end(done);
  });

  it('should return 404 for if todo not found', (done) => {
    request(app)
      .patch(`/todos/${new ObjectID().toHexString()}`)
      .expect(404)
      .end(done);
  });
});

describe('DELETE todos/:id', () => {
  it('should remove a specific todo by id', (done) => {
    request(app)
      .delete(`/todos/${initTodos[0]._id.toHexString()}`)
      .expect(200)
      .expect(res => expect(res.body.todo.text).toBe(initTodos[0].text))
      .end(done);
  });

  it('should return 404 for non ObjectId', (done) => {
    request(app)
      .delete(`/todos/${123}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 for if todo not found', (done) => {
    request(app)
      .delete(`/todos/${new ObjectID().toHexString()}`)
      .expect(404)
      .end(done);
  });
});
