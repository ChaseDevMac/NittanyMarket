const { sequelize } = require('../utils/database');
const { DataTypes, Model } = require('sequelize');

class CartItem extends Model {}

CartItem.init({
  cartId: {
    type: DataTypes.UUID,
    field: 'cart_id',
    primaryKey: true,
  },
  listingId: {
    type: DataTypes.INTEGER,
    field: 'listing_id',
    primaryKey: true,
  },
  sellerEmail: {
    type: DataTypes.STRING,
    field: 'seller_email',
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
},
{
  sequelize,
  modelName: 'CartItem',
  tableName: 'CartItems',
  timestamps: false,
});

module.exports = CartItem;
