const { sequelize } = require('../utils/database');
const { DataTypes, Model } = require('sequelize');

class ProductListing extends Model {}

ProductListing.init({
  sellerEmail: {
    type: DataTypes.STRING,
    field: 'seller_email',
    primaryKey: true,
  },
  listingId: {
    type: DataTypes.INTEGER,
    field: 'listing_id',
    primaryKey: true,
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
    type: DataTypes.TEXT,
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
  postDate: {
    type: DataTypes.DATE,
    field: 'post_date',
  },
  removeDate: {
    type: DataTypes.DATE,
    field: 'remove_date',
  },
}, 
{
  sequelize,
  modelName: 'ProductListing',
  tableName: 'ProductListings',
  timestamps: false
});

module.exports = ProductListing;
