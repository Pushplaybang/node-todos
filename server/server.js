require('./config');
require('./db/mongoose');

const express = require('express');
const bodyParser = require('body-parser');

const todoRoutes = require('./routes/todos');
const userRoutes = require('./routes/users');

const app = express();
const port = process.env.PORT;

// Add basic middleware
app.use(bodyParser.json());

// Setup Routes
app.use('/todos', todoRoutes);
app.use('/users', userRoutes);

app.listen(port, () => {
  console.log(`api started running on ${port}`); // eslint-disable-line
});

module.exports = { app };
