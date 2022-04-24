const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const { requiresLogin, isBuyer, isSeller } = require('../middleware/users');

router.get('/become-a-buyer', requiresLogin, isBuyer, userCtrl.renderBuyerForm);

router.get('/seller-app', requiresLogin, isSeller, userCtrl.renderSellerForm);

router.get('/:email', userCtrl.renderUser);

module.exports = router;
