const { sequelize } = require('../utils/database');
const { DataTypes, Model } = require('sequelize');

class Address extends Model {}

Address.init({
  addrId: {
    type: DataTypes.STRING,
    field: 'addr_id',
    primaryKey: true,
  },
  zipcode: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  streetNum: {
    type: DataTypes.INTEGER,
    field: 'street_num',
    allowNull: false,
  },
  streetName: {
    type: DataTypes.STRING,
    field: 'street_name',
    allowNull: false,
  },
},
{
  sequelize,
  modelName: 'Address',
  tableName: 'Addresses',
  timestamps: false,
});

module.exports = Address;
