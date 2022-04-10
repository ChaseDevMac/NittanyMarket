const { sequelize } = require('../utils/database');
const { DataTypes, Model } = require('sequelize');

class User extends Model {
  static validPassword() {
    console.log('Test');
  }
}

User.init({
  email: {
    type: DataTypes.STRING,
    allowNull: false,
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
  timestamps: false
});

module.exports = User;
