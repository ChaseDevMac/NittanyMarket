const { ProductListing, Rating } = require('../models');
const { sequelize } = require('../utils/database');
const { Op } = require('sequelize');


module.exports.renderUser = async (req, res) => {
  const userEmail = req.params.email;
  const listings = await ProductListing.findAll({
    where: {
      [Op.and]: {
        sellerEmail: userEmail,
        quantity: {[Op.gt]: 0 },
        removeDate: {[Op.is]: null},
      }
    },
  });
  const ratings = await Rating.findAll({where: {sellerEmail: userEmail}})
  const sellerRating = await Rating.findAll({
    where: {sellerEmail: userEmail}, 
    attributes: [[sequelize.fn('avg', sequelize.col('rating')), 'avgRating']]
  });
  res.locals.user = userEmail.split('@')[0];
  res.locals.listings = listings;
  res.locals.ratings = ratings;
  res.locals.sellerRating = sellerRating[0].dataValues.avgRating;
  res.render('users/show');
};
