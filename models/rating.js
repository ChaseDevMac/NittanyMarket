const { sequelize } = require('../utils/database');
const { DataTypes, Model } = require('sequelize');

class Rating extends Model {}

Rating.init({
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
  rateDate: {
    type: DataTypes.STRING,
    field: 'rate_date',
    primaryKey: true,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  desc: {
    type: DataTypes.STRING,
    field: 'rating_desc',
    allowNull: false,
  }
}, 
{
  sequelize,
  modelName: 'Rating',
  tableName: 'Ratings',
  timestamps: false
});

module.exports = Rating;
