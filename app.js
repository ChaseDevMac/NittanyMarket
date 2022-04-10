const express = require('express');
const path = require('path');
const app = express();
const ejsMate = require('ejs-mate');
const bcrypt = require('bcrypt');

const User = require('./models/users');

PORT = 8080;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);

//Middleware
app.use(express.urlencoded({extended: true}));

const db = require('./utils/database');

const validateLogin = async function (req, res, next) {
  const { email, password } = req.body.user;
  const foundUser = await User.findByPk(email);
  if (!foundUser)
    return res.send('Wrong password or email');
  const comparePassword = bcrypt.compareSync(password, foundUser.password);
  if (!comparePassword)
    return res.send('Wrong password or email');
  next();
}

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/login', (req, res) => {
  res.render('users/login');
});

app.post('/login', validateLogin, (req, res) => {
  res.redirect('/');
});

app.get('/register', (req, res) => {
  res.render('users/register');
});

app.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body.user;
    const hashPass = bcrypt.hashSync(password, 12);
    const newUser = User.build({ email, password: hashPass });
    await newUser.save();
    res.redirect('/login');
  } catch (err) {
    console.log(err);
  }
});

app.listen(PORT, () =>{
  console.log(`Listening on ${PORT}`);
});
