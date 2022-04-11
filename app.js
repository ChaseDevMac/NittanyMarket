const express = require('express');
const path = require('path');
const app = express();
const ejsMate = require('ejs-mate');
const bcrypt = require('bcrypt');
const session = require('express-session');

const User = require('./models/users');
const Buyer = require('./models/buyers');
const Order = require('./models/orders');
const Address = require('./models/addresses');

const PORT = 8000;

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
    maxAge: 1000 * 60 * 60 * 24 * 7,
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
const { sequelize } = require('./utils/database');

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

const validatePasswordChange = async function (req, res, next) {
  console.log(req.body.user);
  const { password, 'conf-password': confPassword } = req.body.user;
  console.log(password, confPassword);
  if (password !== confPassword) {
    return res.send("Error: passwords don't match");
  }
  try {
    const hashPassword = bcrypt.hashSync(password, 12);
    await User.update({password: hashPassword}, {where: {email: req.session.email}});
  } catch (err) {
    console.log(err);
  }
  next();
}

const isLoggedIn = async function (req, res, next) {
  console.log('in isLoggedIn');
  if (!req.session.email) {
    return res.redirect('/login');
  }
  next();
}

const getProfile = async function (req, res, next) {
  try {
    const email = req.session.email;
    const query = `SELECT * FROM Buyers WHERE email = '${email}'`;
    const result = await sequelize.query(query, {model: Buyer});
    const profile = { 
      first_name: firstName, 
      last_name: lastName, 
      gender, 
      age, 
      home_addr_id: homeAddr, 
      billing_addr_id: billAddr} = result[0];
    res.locals.profile = profile;
    res.locals.email = email;
    console.log(profile);
  } catch (err) {
    console.log(err);
  }
  next();
}

const getOrders = async function (req, res, next) {
  try {
    const buyerEmail = req.session.email;
    const query = `SELECT * FROM Orders WHERE buyer_email = '${buyerEmail}'`;
    const orders = await sequelize.query(query, {model: Order});
    res.locals.orders = orders;
  } catch (err) {
    console.log(err);
  }
  next();
}

const getAddresses = async function (req, res, next) {
  try {
    const email = req.session.email;
    const query = `SELECT B.first_name, B.last_name, A.street_num, A.street_name, A.zipcode, Z.city, Z.state_id 
                       FROM Addresses A, Buyers B, ZipcodeInfo Z 
                       WHERE B.email='${email}' 
                       AND A.zipcode = Z.zipcode\n AND `;
    const homeAddr = await sequelize.query(query + 'A.addr_id = B.home_addr_id'); 
    const billingAddr = await sequelize.query(query + 'A.addr_id = B.billing_addr_id');
    res.locals.homeAddr = homeAddr[0][0];
    res.locals.billingAddr = billingAddr[0][0];
  } catch (err) {
    console.log(err);
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

app.get('/account', isLoggedIn, (req, res) => {
  res.render('users/account');
})

app.get('/change_password', isLoggedIn, (req, res) => {
  res.render('users/change_password');
})

app.post('/change_password', isLoggedIn, validatePasswordChange, (req, res) => {
  //TODO: implement a flash telling user must log back in
  req.session.destroy();
  res.redirect('/login');
});

app.get('/orders', isLoggedIn, getOrders, async (req, res) => {
  res.render('users/orders');
})

app.get('/profile', isLoggedIn, getProfile, (req, res) => {
  res.render('users/profile');
});

app.get('/addresses', isLoggedIn, getAddresses, (req, res) => {
  res.render('users/addresses');
});

app.listen(PORT, () =>{
  console.log(`Listening on ${PORT}`);
});
