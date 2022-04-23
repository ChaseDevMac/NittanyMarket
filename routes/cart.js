const express = require('express');
const router = express.Router();

const cartCtrl = require('../controllers/cart');

router.route('/')
  .get(cartCtrl.showCart)
  .post(cartCtrl.addToCart);

router.route('/checkout')
  .get(cartCtrl.showCheckout)
  .post(cartCtrl.checkout);

module.exports = router;
