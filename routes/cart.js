const express = require('express');
const router = express.Router();

const cartCtrl = require('../controllers/cart');
const userMidware = require('../middleware/users');

router.route('/')
  .get(userMidware.requiresLogin, cartCtrl.showCart)
  .post(userMidware.requiresLogin, cartCtrl.addToCart)
  .delete(userMidware.requiresLogin, cartCtrl.removeCartItem);

router.route('/checkout')
  .get(userMidware.requiresLogin, cartCtrl.showCheckout)
  .post(userMidware.requiresLogin, cartCtrl.checkout);

module.exports = router;
