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
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING,
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
  home_addr_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  billing_addr_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, 
{
  sequelize,
  modelName: 'Buyer',
  timestamps: false
});

module.exports = Buyer;

