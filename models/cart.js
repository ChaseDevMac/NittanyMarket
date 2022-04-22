const { sequelize } = require('../utils/database');
const { DataTypes, Model } = require('sequelize');

class Cart extends Model {}

Cart.init({
  cartId: {
    type: DataTypes.UUID,
    field: 'cart_id',
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
},
{
  sequelize,
  modelName: 'Cart',
  tableName: 'Carts',
  timestamps: false,
});

module.exports = Cart;
