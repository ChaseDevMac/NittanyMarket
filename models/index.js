const User = require('./user');
const Zipcode = require('./zipcodeinfo');
const Address = require('./address');
const Buyer = require('./buyer');
const CreditCard = require('./creditcard');
const Seller = require('./seller');
const LocalVendor = require('./localvendor');
const Category = require('./category');
const ProductListing = require('./productlisting');
const Order = require('./order');
const Review = require('./review');
const Rating = require('./rating');

// User Associations
User.hasOne(Buyer, {
  foreignKey: 'email',
  sourceKey: 'email',
});
User.hasOne(Seller, {
  foreignKey: 'email',
  sourceKey: 'email',
});
User.hasOne(CreditCard, {
  foreignKey: 'owner',
  sourceKey: 'email',
});

// Buyer Associations
Buyer.belongsTo(User, {
  foreignKey: 'email',
  sourceKey: 'email',
});
Buyer.hasOne(Address, {
  foreignKey: 'addr_id',
  sourceKey: 'homeAddrId',
  as: 'homeAddress'
});
Buyer.hasOne(Address, {
  foreignKey: 'addr_id',
  sourceKey: 'billAddrId',
  as: 'billAddress',
});

// Address Associations
Address.hasOne(Zipcode, {
  foreignKey: 'zipcode',
  sourceKey: 'zipcode',
});

// Seller Associations
Seller.belongsTo(User, {
  foreignKey: 'email',
  sourceKey: 'email',
});

// Category Associations
Category.hasOne(Category, {
  foreignKey: 'parent_cate',
  sourceKey: 'child',
});

// ProductListing Associations
ProductListing.hasOne(Seller, {
  foreignKey: 'email',
  sourceKey: 'sellerEmail'
});
ProductListing.hasOne(Category, {
  foreignKey: 'cate_name',
  sourceKey: 'category',
});

// Order Associations
Order.hasOne(Seller, {
  foreignKey: 'email',
  sourceKey: 'sellerEmail'
});
Order.hasOne(ProductListing, {
  foreignKey: 'listingId',
  sourceKey: 'listingId',
  as: 'listingInfo',
});
Order.hasOne(Buyer, {
  foreignKey: 'email',
  sourceKey: 'buyerEmail',
});

// Review Associations
Review.hasOne(Buyer, {
  foreignKey: 'email',
  sourceKey: 'buyerEmail',
});
Review.hasOne(Seller, {
  foreignKey: 'email',
  sourceKey: 'sellerEmail',
});
Review.hasOne(ProductListing, {
  foreignKey: 'listingId',
  sourceKey: 'listingId',
});

// Rating Associations
Rating.hasOne(Buyer, {
  foreignKey: 'email',
  sourceKey: 'buyerEmail',
});
Rating.hasOne(Seller, {
  foreignKey: 'email',
  sourceKey: 'sellerEmail',
});


module.exports = {
  User,
  Zipcode,
  Address,
  Buyer,
  CreditCard,
  Seller,
  LocalVendor,
  Category,
  ProductListing,
  Order,
  Review,
  Rating,
};
