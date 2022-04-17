const { sequelize } = require('../utils/database');
const { DataTypes, Model } = require('sequelize');

class Order extends Model {}

Order.init({
  transactionId: {
    type: DataTypes.INTEGER,
    field: 'transaction_id',
    primaryKey: true,
  },
  sellerEmail: {
    type: DataTypes.STRING,
    field: 'seller_email',
    allowNull: false,
  },
  listingId: {
    type: DataTypes.INTEGER,
    field: 'listing_id',
    allowNull: false,
  },
  buyerEmail: {
    type: DataTypes.STRING,
    field: 'buyer_email',
    allowNull: false,
  },
  orderDate: {
    type: DataTypes.DATE,
    field: 'order_date',
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
  tableName: 'Orders',
  timestamps: false,
});

module.exports = Order;
