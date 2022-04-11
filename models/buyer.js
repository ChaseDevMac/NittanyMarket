const { sequelize } = require('../utils/database');
const { DataTypes, Model } = require('sequelize');
// const User = require('./users');

class Buyer extends Model {}

Buyer.init({
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  firstName: {
    type: DataTypes.STRING,
    field: 'first_name',
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    field: 'last_name',
    allowNull: false,
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  homeAddrId: {
    type: DataTypes.STRING,
    field: 'home_addr_id',
    allowNull: false,
  },
  billAddrId: {
    type: DataTypes.STRING,
    field: 'billing_addr_id',
    allowNull: false,
  },
}, 
{
  sequelize,
  modelName: 'Buyer',
  timestamps: false
});

module.exports = Buyer;

