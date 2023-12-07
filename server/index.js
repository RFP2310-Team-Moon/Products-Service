const express = require('express');
const path = require('path');
const router = require('./router');

const app = express();
const port = 3000;

app.use(express.json());
app.use('/api', router);

app.listen(port, (err) => {
  if (err) {
    console.log('Error starting server');
  } else {
    console.log('Server starting on port', port);
  }
});
