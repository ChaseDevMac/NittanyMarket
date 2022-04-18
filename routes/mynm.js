const express = require('express');
const router = express.Router();

const mynmCtrl = require('../controllers/mynm');
const midware = require('../middleware/users');

router.get('/logout', midware.isLoggedIn, mynmCtrl.logout);

router.get('/', midware.isLoggedIn, mynmCtrl.account);

router.get('/change_password', midware.isLoggedIn, mynmCtrl.changePasswordForm);

router.post('/change_password', midware.isLoggedIn, mynmCtrl.validatePasswordChange, mynmCtrl.changePassword);

router.get('/profile', midware.isLoggedIn, mynmCtrl.getProfile, mynmCtrl.viewProfile);

router.get('/orders', midware.isLoggedIn, mynmCtrl.getOrders, mynmCtrl.viewOrders);

router.get('/addresses', midware.isLoggedIn, mynmCtrl.viewAddresses);

router.get('/cards', midware.isLoggedIn, mynmCtrl.getCreditCards, mynmCtrl.viewCards);

module.exports = router;
