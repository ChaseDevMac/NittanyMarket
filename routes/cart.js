const express = require('express');
const router = express.Router();

const cartCtrl = require('../controllers/cart');
const { requiresLogin, requiresBuyer } = require('../middleware/users');

router.route('/')
  .get(requiresLogin, cartCtrl.showCart)
  .post(requiresLogin, cartCtrl.addToCart)
  .delete(requiresLogin, cartCtrl.removeCartItem);

router.route('/checkout')
  .get(requiresBuyer, cartCtrl.showCheckout)
  .post(requiresBuyer, cartCtrl.checkout);

module.exports = router;
