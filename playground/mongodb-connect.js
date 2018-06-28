const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect(
  'mongodb://localhost:27017/TodoApp',
  (err, client) => {
    if (err) {
      console.log('could not connect', err);
      return;
    }

    console.log('connected to mongodb server');
    const db = client.db('TodoApp');

    db.collection('Todos').insertOne(
      {
        text: 'something to do',
        completed: false,
      },
      (err, res) => {
        if (err) {
          console.log('err', err);
          return;
        }

        console.log('success', JSON.stringify(res.ops, undefined, 2));
      },
    );

    client.close();
  },
);
