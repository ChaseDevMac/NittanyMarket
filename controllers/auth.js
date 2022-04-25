const { User, Buyer, Seller, Cart } = require('../models');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

// autheticate the given email and password
async function isValidLogin (email, password) {
  const foundUser = await User.findByPk(email);
  if (!foundUser) return false;

  const comparePassword = bcrypt.compareSync(password, foundUser.password);
  if (!comparePassword) return false;

  return true;
};

// verify the user is a buyer
async function isBuyer(email) {
  const foundBuyer = await Buyer.findByPk(email);
  if (!foundBuyer) return false;

  return true;
}

// verify the user is a seller
async function isSeller(email) {
  const foundSeller = await Seller.findByPk(email);
  if (!foundSeller) return false;

  return true;
}

module.exports.loginForm = (req, res) => {
  res.render('auth/login');
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body.user;

  // return the user to login page and flash invalid login attempt
  if (!await isValidLogin(email, password)) {
    req.flash('error', 'Incorrect email address or password');
    return res.redirect('/login');
  }

  // add cartId on successful login
  req.session.email = req.body.user.email;
  let foundCart = await Cart.findOne({where: {email}});
  if (!foundCart) foundCart = await Cart.create({ cartId: uuidv4(), email});
  req.session.cartId = foundCart.cartId

  // check if the user is a buyer and/or a seller
  if (await isBuyer(email)) req.session.isBuyer = true;
  if (await isSeller(email)) req.session.isSeller = true;

  // redirect the user to the page the were on before logging in
  req.flash('success', `Welcome back, ${email}!`);
  const redirectUrl = req.session.returnTo || '/';
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

module.exports.registerForm = (req, res) => {
  res.render('auth/register');
};

module.exports.register = async (req, res) => {
  // hash the given password and insert the user data into database
  const { email, password } = req.body.user;
  const hashPass = bcrypt.hashSync(password, 12);
  const newUser = await User.create({ email, password: hashPass });

  // create a cart for the new user
  const newCart = await Cart.create({ cartId: uuidv4(), email});

  // set session data
  req.session.cartId = newCart.cartId;
  req.session.email = newUser.email;
  req.flash('success', 'Thank you for creating an account');
  return res.redirect('/');
}
