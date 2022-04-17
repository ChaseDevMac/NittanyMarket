const { sequelize } = require('../utils/database');
const { DataTypes, Model } = require('sequelize');

class Review extends Model {}

Review.init({
  listingId: {
    type: DataTypes.INTEGER,
    field: 'listing_id',
    primaryKey: true,
  },
  buyerEmail: {
    type: DataTypes.STRING,
    field: 'buyer_email',
    primaryKey: true,
  },
  sellerEmail: {
    type: DataTypes.STRING,
    field: 'seller_email',
    primaryKey: true,
  },
  desc: {
    type: DataTypes.TEXT,
    field: 'review_desc',
    allowNull: false,
  },
}, 
{
  sequelize,
  modelName: 'Review',
  tableName: 'Reviews',
  timestamps: false
});

module.exports = Review;
