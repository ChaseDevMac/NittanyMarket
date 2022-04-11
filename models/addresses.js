const { sequelize } = require('../utils/database');
const { DataTypes, Model } = require('sequelize');

class Address extends Model {}

Address.init({
  addr_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  zipcode: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  street_num: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  street_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
},
{
  sequelize,
  modelName: 'Address',
  timestamps: false,
});

module.exports = Address;
