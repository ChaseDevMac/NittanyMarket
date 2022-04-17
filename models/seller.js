const { sequelize } = require('../utils/database');
const { DataTypes, Model } = require('sequelize');

class Seller extends Model {}

Seller.init({
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  routingNum: {
    type: DataTypes.STRING,
    field: 'routing_num',
    allowNull: false,
  }, 
  accountNum: {
    type: DataTypes.INTEGER,
    field: 'account_num',
    allowNull: false,
  }, 
  balance: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  }, 
},
{
  sequelize,
  modelName: 'Seller',
  tableName: 'Sellers',
  timestamps: false
});

module.exports = Seller;
