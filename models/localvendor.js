const { sequelize } = require('../utils/database');
const { DataTypes, Model } = require('sequelize');

class LocalVendor extends Model {}

LocalVendor.init({
  email: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  businessName: {
    type: DataTypes.STRING,
    field: 'busi_name',
    allowNull: false,
  },
  businessAddrId: {
    type: DataTypes.STRING,
    field: 'busi_addr_id',
    allowNull: false,
  },
  customerServiceNum: {
    type: DataTypes.STRING,
    field: 'customer_service_num',
    allowNull: false,
  },
}, 
{
  sequelize,
  modelName: 'LocalVendor',
  tableName: 'LocalVendors',
  timestamps: false
});

module.exports = LocalVendor;
