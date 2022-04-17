const { sequelize } = require('../utils/database');
const { DataTypes, Model } = require('sequelize');

class Zipcode extends Model {}

Zipcode.init({
  zipcode: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  stateId: {
    type: DataTypes.STRING,
    field: 'state_id',
    allowNull: false,
  },
  population: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  density: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  timezone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
},
{
  sequelize,
  modelName: 'Zipcode',
  tableName: 'ZipcodeInfo',
  timestamps: false,
});

module.exports = Zipcode;
