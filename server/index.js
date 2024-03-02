const express = require('express');
const router = require('./routes/productRoutes');

const app = express();
const port = 3000;

app.use(express.json());
app.use('/', router);

app.listen(port, (err) => {
  if (err) {
    console.log('Error starting server');
  } else {
    console.log('Server starting on port', port);
  }
});
