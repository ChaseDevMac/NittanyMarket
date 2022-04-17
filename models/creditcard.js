const { sequelize } = require('../utils/database');
const { DataTypes, Model } = require('sequelize');

class CreditCard extends Model {}

CreditCard.init({
  ccn: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  ccv: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  expMonth: {
    type: DataTypes.INTEGER,
    field: 'exp_month',
    allowNull: false,
  },
  expYear: {
    type: DataTypes.INTEGER,
    field: 'exp_year',
    allowNull: false,
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  owner: {
    type: DataTypes.STRING,
    allowNull: false,
  },
},
{
  sequelize,
  modelName: 'CreditCard',
  tableName: 'CreditCards',
  timestamps: false,
});

module.exports = CreditCard;
