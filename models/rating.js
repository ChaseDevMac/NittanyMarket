const { sequelize } = require('../utils/database');
const { DataTypes, Model } = require('sequelize');

class Rating extends Model {}

Rating.init({
  buyerEmail: {
    type: DataTypes.STRING,
    field: 'buyer_email',
    allowNull: false,
    primaryKey: true,
  },
  sellerEmail: {
    type: DataTypes.STRING,
    field: 'seller_email',
    allowNull: false,
  },
  rateDate: {
    type: DataTypes.STRING,
    field: 'rate_date',
    allowNull: false,
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
  timestamps: false
});

module.exports = Rating;


