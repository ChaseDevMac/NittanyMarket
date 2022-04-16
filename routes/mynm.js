const express = require('express');
const router = express.Router();

const mynmCtrl = require('../controllers/mynm');

router.get('/logout', mynmCtrl.isLoggedIn, mynmCtrl.logout);

router.get('/', mynmCtrl.isLoggedIn, mynmCtrl.account);

router.get('/change_password', mynmCtrl.isLoggedIn, mynmCtrl.changePasswordForm);

router.post('/change_password', mynmCtrl.isLoggedIn, mynmCtrl.validatePasswordChange, mynmCtrl.changePassword);

router.get('/profile', mynmCtrl.isLoggedIn, mynmCtrl.getProfile, mynmCtrl.viewProfile);

router.get('/orders', mynmCtrl.isLoggedIn, mynmCtrl.getOrders, mynmCtrl.viewOrders);

router.get('/addresses', mynmCtrl.isLoggedIn, mynmCtrl.getAddresses, mynmCtrl.viewAddresses);

router.get('/cards', mynmCtrl.isLoggedIn, mynmCtrl.getCreditCards, mynmCtrl.viewCards);

module.exports = router;
