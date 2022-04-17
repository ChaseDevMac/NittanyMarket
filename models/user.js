const { sequelize } = require('../utils/database');
const { DataTypes, Model } = require('sequelize');

class User extends Model {}

User.init({
  email: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, 
{
  sequelize,
  modelName: 'User',
  tableName: 'Users',
  timestamps: false
});

module.exports = User;
