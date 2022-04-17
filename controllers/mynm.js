const bcrypt = require('bcrypt');

const { sequelize } = require('../utils/database');
const User = require('../models/user');
const Buyer = require('../models/buyer');
const Order = require('../models/order');
const Address = require('../models/address');

module.exports.validatePasswordChange = async function (req, res, next) {
  const { password, 'conf-password': confPassword } = req.body.user;
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
};

module.exports.isLoggedIn = async function (req, res, next) {
  if (!req.session.email) {
    return res.redirect('/login');
  }
  next();
};

module.exports.getProfile = async function (req, res, next) {
  try {
    const email = req.session.email;
    const profile = await Buyer.findByPk(email);
    res.locals.profile = profile;
  } catch (err) {
    console.log(err);
  }
  next();
};

module.exports.getOrders = async function (req, res, next) {
  try {
    const buyerEmail = req.session.email;
    const orders = await Order.findAll({where: {buyerEmail: buyerEmail}, order: [['orderDate', 'DESC']]});
    res.locals.orders = orders;
  } catch (err) {
    console.log(err);
  }
  next();
};

module.exports.getAddresses = async function (req, res, next) {
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
};

module.exports.getCreditCards = async function (req, res, next) {
  try {
    const email = req.session.email;
    const query = `SELECT B.first_name, B.last_name, C.ccn, C.exp_month, C.exp_year, C.brand
                    FROM Buyers B, CreditCards C
                    WHERE B.email = '${email}'
                    AND B.email = C.owner`;
    const result = await sequelize.query(query);
    let card = result[0][0];
    card.ccn = card.ccn.slice(-4);
    res.locals.card = card;
  } catch(err) {
    console.log(err);
  }
  next();
};

module.exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

module.exports.account = (req, res) => {
  res.render('mynm/account');
};

module.exports.changePasswordForm = (req, res) => {
  res.render('mynm/change_password');
};

module.exports.changePassword = (req, res) => {
  //TODO: implement a flash telling user must log back in
  req.session.destroy();
  res.redirect('/login');
};

module.exports.viewProfile = (req, res) => {
  res.render('mynm/profile');
};

module.exports.viewOrders = (req, res) => {
  res.render('mynm/orders');
};

module.exports.viewAddresses = (req, res) => {
  res.render('mynm/addresses');
};

module.exports.viewCards = (req, res) => {
  res.render('mynm/cards');
};
