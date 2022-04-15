const { sequelize } = require('../utils/database');
const { DataTypes, Model } = require('sequelize');

class Review extends Model {
  static validPassword() {
    console.log('Test');
  }
}

Review.init({
  listingId: {
    type: DataTypes.INTEGER,
    field: 'listing_id',
    allowNull: false,
    primaryKey: true,
  },
  buyerEmail: {
    type: DataTypes.STRING,
    field: 'buyer_email',
    allowNull: false,
  },
  sellerEmail: {
    type: DataTypes.STRING,
    field: 'seller_email',
    allowNull: false,
  },
  desc: {
    type: DataTypes.STRING,
    field: 'review_desc',
    allowNull: false,
  }
}, 
{
  sequelize,
  modelName: 'Review',
  timestamps: false
});

module.exports = Review;

