const express = require('express');
const app = express();

PORT = 8080;

const db = require('./utils/database');
// console.log(db.port);

db.testDB();

app.get('/', (req, res) => {
  res.send('MariaDB connected');
});

app.listen(PORT, () =>{
  console.log(`Listening on ${PORT}`);
});
