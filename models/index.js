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
const Cart = require('./cart');
const CartItem = require('./cartitem');

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
Seller.hasMany(Rating, {
  foreignKey: 'sellerEmail',
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
ProductListing.hasMany(Review, {
  foreignKey: 'listingId',
  sourceKey: 'listingId',
})

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
Review.belongsTo(ProductListing, {
  foreignKey: 'listingId',
  sourceKey: 'listingId',
});

// Rating Associations
// Rating.belongsTo(Buyer, {
//   foreignKey: 'email',
//   sourceKey: 'buyerEmail',
// });
// Rating.belongsTo(Seller, {
//   foreignKey: 'email',
//   sourceKey: 'sellerEmail',
// });

// Cart Associations
Cart.hasMany(CartItem, {
  foreignKey: 'cartId',
  sourceKey: 'cartId',
});

// CartItem Associations
CartItem.hasOne(ProductListing, {
  foreignKey: 'listingId',
  sourceKey: 'listingId',
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
