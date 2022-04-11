const { sequelize } = require('../utils/database');
const { DataTypes, Model } = require('sequelize');

class Order extends Model {}

Order.init({
  transaction_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  seller_email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  listing_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  buyer_email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  order_date: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  payment: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, 
{
  sequelize,
  modelName: 'Order',
  timestamps: false,
});

module.exports = Order;
