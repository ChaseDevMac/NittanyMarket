const { sequelize } = require('../utils/database');
const { DataTypes, Model } = require('sequelize');

class Category extends Model {}

Category.init({
  child: {
    type: DataTypes.STRING,
    field: 'cate_name',
    primaryKey: true,
  },
  parent: {
    type: DataTypes.STRING,
    field: 'parent_cate',
    allowNull: false,
  },
}, 
{
  sequelize,
  modelName: 'Category',
  tableName: 'Categories',
  timestamps: false
});

module.exports = Category;
