const bcrypt = require('bcrypt');

const { sequelize } = require('../utils/database');
const { User, Buyer, Order, Address, Zipcode, ProductListing } = require('../models');

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
    const orders = await Order.findAll({
      where: {buyerEmail: buyerEmail}, 
      attributes: [
        'sellerEmail',
        'listingId',
        'orderDate',
        'quantity',
        'payment',
        // [sequelize.col('listingInfo.title'), 'title'],
        // [sequelize.col('listingInfo.product_name'), 'productName'],
      ],
      order: [['orderDate', 'DESC']],
      include: {
        model: ProductListing,
        as: 'listingInfo',
        attributes: ['title', 'listingId'],
      }
    });
    res.locals.orders = orders;
  } catch (err) {
    console.log(err);
  }
  next();
};

async function getBuyerAddress(email) {
  const result = await Buyer.findByPk(email, {
    attributes: ['firstName', 'lastName'],
    include: [{
      model: Address,
      as: 'homeAddress',
      attributes: ['streetNum', 'streetName'],
      include: {
        model: Zipcode,
        attributes: ['zipcode', 'city', 'stateId']
      }
    }, { 
      model: Address,
      as: 'billAddress',
      attributes: ['streetNum', 'streetName'],
      include: {
        model: Zipcode,
        attributes: ['zipcode', 'city', 'stateId']
      }
    }]
  });
  return result;
}

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

module.exports.viewAddresses = async (req, res) => {
  const result = await getBuyerAddress(req.session.email);
  // res.send(result.homeAddress);
  const homeAddress = result.homeAddress;
  const billAddress = result.billAddress;
  res.locals.homeAddr = {
    "name": `${result.firstName} ${result.lastName}`,
    "streetInfo": `${homeAddress.streetNum} ${homeAddress.streetName}`,
    "zipcodeInfo": `${homeAddress.Zipcode.zipcode} ${homeAddress.Zipcode.city} ${homeAddress.Zipcode.stateId}`
  }
  res.locals.billAddr = {
    "name": `${result.firstName} ${result.lastName}`,
    "streetInfo": `${billAddress.streetNum} ${billAddress.streetName}`,
    "zipcodeInfo": `${billAddress.Zipcode.zipcode} ${billAddress.Zipcode.city} ${billAddress.Zipcode.stateId}`
  }
  res.render('mynm/addresses');
};

module.exports.viewCards = (req, res) => {
  res.render('mynm/cards');
};
