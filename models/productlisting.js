const { sequelize } = require('../utils/database');
const { DataTypes, Model } = require('sequelize');

class ProductListing extends Model {}

ProductListing.init({
  sellerEmail: {
    type: DataTypes.STRING,
    field: 'seller_email',
    allowNull: false,
    primaryKey: true,
  },
  listingId: {
    type: DataTypes.INTEGER,
    field: 'listing_id',
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  productName: {
    type: DataTypes.STRING,
    field: 'product_name',
    allowNull: false,
  },
  productDesc: {
    type: DataTypes.STRING,
    field: 'product_desc',
    allowNull: false,
  },
  price: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, 
{
  sequelize,
  modelName: 'ProductListing',
  timestamps: false
});

module.exports = ProductListing;



