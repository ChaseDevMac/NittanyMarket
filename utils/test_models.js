const models = require('../models');

module.exports.testModels = async function () {
  try {
    const reviews = await models.Review.findAll({where: {listingId: 780}, include: [models.ProductListing]});
    const orders = await models.Order.findAll({
      where: {buyerEmail: 'agoly4g@nsu.edu'}, 
      include: {
        model: models.ProductListing,
        as: 'listingInfo',
        include: [models.Seller]
      }
    });
    const productListings = await models.ProductListing.findAll({where: {sellerEmail: 'agoly4g@nsu.edu'}});
    const userSeller = await models.User.findByPk('agoly4g@nsu.edu', {include: [models.Seller]});
    const seller = await models.Seller.findByPk('agoly4g@nsu.edu', {include: [models.User]});
    const address = await models.Address.findByPk("12eaca25687449e9b937e1657a6a1c45", {include: models.Zipcode});
    const user = await models.User.findAll({
      where: {email: 'agoly4g@nsu.edu'}, 
      include: [{
        model: models.Buyer,
        include: [{
          model: models.Address,
          as: 'homeAddress',
          attributes: ['zipcode', 'streetNum', 'streetName'],
        }, {
          model: models.Address,
          as: 'billAddress',
          attributes: ['zipcode', 'streetNum', 'streetName'],
          }],
      }]
    });
    const buyers = await models.Buyer.findAll({
      where: {email: 'agoly4g@nsu.edu'},
      include: [{
        required: true,
        model: models.Address,
        as: 'homeAddress'
      }, {
        required: true,
        model: models.Address,
        as: 'billAddress'
      }],
    });
    const buyerInfo = await models.Buyer.findByPk('agoly4g@nsu.edu', {
      attributes: ['firstName', 'lastName'],
      include: [{
        model: models.Address,
        as: 'homeAddress',
        attributes: ['streetNum', 'streetName'],
        include: {
          model: models.Zipcode,
          attributes: ['zipcode', 'city', 'stateId']
        }
      }, { 
        model: models.Address,
        as: 'billAddress',
        attributes: ['streetNum', 'streetName'],
        include: {
          model: models.Zipcode,
          attributes: ['zipcode', 'city', 'stateId']
        }
      }]
    });
    // console.log({reviews, orders, productListings, userSeller, seller, address, user, buyers})
    return buyerInfo;
  } catch (err) {
    console.log(err);
  }
}
