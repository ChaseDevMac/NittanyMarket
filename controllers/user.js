const { ProductListing, Rating } = require('../models');
const { sequelize } = require('../utils/database');
const { Op } = require('sequelize');

// display the user's public profile
module.exports.renderUser = async (req, res) => {
  const userEmail = req.params.email;

  // find all the listings under the seller
  const listings = await ProductListing.findAll({
    where: {
      sellerEmail: userEmail,
      quantity: {[Op.gt]: 0 },
      removeDate: {[Op.is]: null},
    }
  });

  // find all the ratings associated with the seller
  const ratings = await Rating.findAll({where: {sellerEmail: userEmail}})

  // calculate the overall average rating for the seller
  const sellerRating = await Rating.findOne({
    where: {sellerEmail: userEmail}, 
    attributes: [[sequelize.fn('avg', sequelize.col('rating')), 'avgRating']]
  });
  res.locals.user = userEmail.split('@')[0]; // remove the email provider of address
  res.locals.listings = listings;
  res.locals.ratings = ratings;
  res.locals.sellerRating = sellerRating.dataValues.avgRating;
  res.render('users/show');
};

module.exports.renderBuyerForm = (req, res) => {
  res.render('users/buyer_form');
};

module.exports.renderSellerForm = (req, res) => {
  res.render('users/seller_form');
};
