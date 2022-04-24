const express = require('express');
const router = express.Router();

const mynmCtrl = require('../controllers/mynm');
const { requiresLogin, requiresBuyer, requiresSeller } = require('../middleware/users');

router.get('/logout', requiresLogin, mynmCtrl.logout);

router.get('/', requiresLogin, mynmCtrl.account);

router.route('/change_password')
  .get(requiresLogin, mynmCtrl.changePasswordForm)
  .post(requiresLogin, mynmCtrl.validatePasswordChange, mynmCtrl.changePassword);

router.get('/profile', requiresLogin, requiresBuyer, mynmCtrl.getProfile, mynmCtrl.viewProfile);

router.get('/orders', requiresLogin, requiresBuyer, mynmCtrl.getOrders, mynmCtrl.viewOrders);

router.get('/addresses', requiresLogin, requiresBuyer, mynmCtrl.viewAddresses);

router.get('/cards', requiresLogin, requiresBuyer, mynmCtrl.getCreditCards, mynmCtrl.viewCards);

router.get('/listings', requiresLogin, requiresSeller, mynmCtrl.viewListings);

module.exports = router;
