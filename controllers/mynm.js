const bcrypt = require('bcrypt');

const { sequelize } = require('../utils/database');
const { User, Buyer, Order, Address, Zipcode, ProductListing, Review, Rating } = require('../models');

// validate the password change request
module.exports.validatePasswordChange = async function (req, res, next) {
  const { password, 'conf-password': confPassword } = req.body.user;
  // verify that the password fields match
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

// find the information about a buyer
module.exports.getProfile = async function (req, res, next) {
  res.locals.profile = await Buyer.findByPk(req.session.email);
  next();
};

// find all the orders for a buyer
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
      ],
      order: [['orderDate', 'DESC']],
      include: {
        model: ProductListing,
        as: 'listingInfo',
        attributes: ['title', 'listingId'],
        include: {
          model: Review,
        }
      }
    });

    // For each order check if the user has reviewed and/or rated that order/seller
    for (let order of orders) {
      const fmtDate = order.orderDate.toISOString().slice(0, 10); // remove time component of date
      order.fmtDate = fmtDate;
      order.listingInfo.Reviews.forEach(review => {
        if (buyerEmail === review.dataValues.buyerEmail) {
          order.isReviewed = true;
        };
      });
      const isRated = await Rating.findOne({
        where: {
          sellerEmail: order.sellerEmail,
          buyerEmail: buyerEmail,
        }
      })
      if (isRated) order.isRated = true;
    }
    res.locals.orders = orders;
  } catch (err) {
    console.log(err);
  }
  next();
};

// find all the address information on a buyer
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

// find the credit card associated with a buyer
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
  const homeAddress = result.homeAddress;
  const billAddress = result.billAddress;
  // format billing and home address for HTML template
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

module.exports.viewListings = async (req, res) => {
  const email = req.session.email;
  const listings = await ProductListing.findAll({where: {sellerEmail: email}});
  res.locals.listings = listings;
  res.render('mynm/listings');
};
