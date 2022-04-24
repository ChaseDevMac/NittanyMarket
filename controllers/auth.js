const { User, Buyer, Seller, Cart } = require('../models');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

async function isValidLogin (email, password) {
  const foundUser = await User.findByPk(email);
  if (!foundUser) return false;

  const comparePassword = bcrypt.compareSync(password, foundUser.password);
  if (!comparePassword) return false;

  return true;
};

async function isBuyer(email) {
  const foundBuyer = await Buyer.findByPk(email);
  if (!foundBuyer) return false;

  return true;
}

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
  if (!await isValidLogin(email, password)) {
    req.flash('error', 'Incorrect email address or password');
    return res.redirect('/login');
  }
  req.session.email = req.body.user.email;
  let foundCart = await Cart.findOne({where: {email}});
  if (!foundCart) foundCart = await Cart.create({ cartId: uuidv4(), email});
  req.session.cartId = foundCart.cartId

  if (await isBuyer(email)) req.session.isBuyer = true;
  if (await isSeller(email)) req.session.isSeller = true;
  req.flash('success', `Welcome back, ${email}!`);
  const redirectUrl = req.session.returnTo || '/';
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

module.exports.registerForm = (req, res) => {
  res.render('auth/register');
};

module.exports.register = async (req, res) => {
  try {
    const { email, password } = req.body.user;
    const hashPass = bcrypt.hashSync(password, 12);
    const newUser = User.build({ email, password: hashPass });
    await newUser.save();
    req.session.email = newUser.email;
    const newCart = await Cart.create({ cartId: uuidv4(), email});
    req.session.cartId = newCart.cartId;
    return res.redirect('/');
  } catch (err) {
    console.log(err);
    res.send('Error');
  }
}
