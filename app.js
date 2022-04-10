const express = require('express');
const path = require('path');
const app = express();
const ejsMate = require('ejs-mate');
const bcrypt = require('bcrypt');
const session = require('express-session');

const User = require('./models/users');

const PORT = 8080;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);

const sessionConfig = {
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // sameSite: true,
    // maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

//Middleware
app.use(express.urlencoded({extended: true}));
app.use(session(sessionConfig));
app.use((req, res, next) => {
  console.log(req.session);
  res.locals.user = req.session.email;
  next();
})

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

const isLoggedIn = async function (req, res, next) {
  console.log('in isLoggedIn');
  if (!req.session.email) {
    return res.redirect('/login');
  }
  next();
}

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/login', (req, res) => {
  res.render('users/login');
});

app.post('/login', validateLogin, (req, res) => {
  console.log(req.body);
  req.session.email = req.body.user.email;
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
    req.session.email = newUser.email;
    return res.redirect('/');
  } catch (err) {
    console.log(err);
    res.send('Error');
  }
});

app.get('/logout', isLoggedIn, (req, res) => {
  req.session.destroy();
  res.redirect('/');
})

app.listen(PORT, () =>{
  console.log(`Listening on ${PORT}`);
});
