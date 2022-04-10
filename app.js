const express = require('express');
const path = require('path');
const app = express();
const ejsMate = require('ejs-mate');

PORT = 8080;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);

//Middleware

const db = require('./utils/database');

app.get('/', (req, res) => {
  res.render('home');
});

app.listen(PORT, () =>{
  console.log(`Listening on ${PORT}`);
});
