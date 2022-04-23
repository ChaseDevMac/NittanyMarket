const express = require('express');
const router = express.Router();

const mynmCtrl = require('../controllers/mynm');
const { requiresLogin } = require('../middleware/users');

router.get('/logout', requiresLogin, mynmCtrl.logout);

router.get('/', requiresLogin, mynmCtrl.account);

router.get('/change_password', requiresLogin, mynmCtrl.changePasswordForm);

router.post('/change_password', requiresLogin, mynmCtrl.validatePasswordChange, mynmCtrl.changePassword);

router.get('/profile', requiresLogin, mynmCtrl.getProfile, mynmCtrl.viewProfile);

router.get('/orders', requiresLogin, mynmCtrl.getOrders, mynmCtrl.viewOrders);

router.get('/addresses', requiresLogin, mynmCtrl.viewAddresses);

router.get('/cards', requiresLogin, mynmCtrl.getCreditCards, mynmCtrl.viewCards);

router.get('/listings', requiresLogin, mynmCtrl.viewListings);

module.exports = router;
