const express = require('express');
const router = express.Router();

const usersCtrl = require('../controllers/users');

router.get('/logout', usersCtrl.isLoggedIn, usersCtrl.logout);

router.get('/account', usersCtrl.isLoggedIn, usersCtrl.account);

router.get('/change_password', usersCtrl.isLoggedIn, usersCtrl.changePasswordForm);

router.post('/change_password', usersCtrl.isLoggedIn, usersCtrl.validatePasswordChange, usersCtrl.changePassword);

router.get('/profile', usersCtrl.isLoggedIn, usersCtrl.getProfile, usersCtrl.viewProfile);

router.get('/orders', usersCtrl.isLoggedIn, usersCtrl.getOrders, usersCtrl.viewOrders);

router.get('/addresses', usersCtrl.isLoggedIn, usersCtrl.getAddresses, usersCtrl.viewAddresses);

router.get('/cards', usersCtrl.isLoggedIn, usersCtrl.getCreditCards, usersCtrl.viewCards);

module.exports = router;
