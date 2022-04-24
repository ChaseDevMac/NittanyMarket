const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

router.get('/become-a-buyer', userCtrl.renderBuyerForm);

router.get('/seller-app', userCtrl.renderSellerForm);

router.get('/:email', userCtrl.renderUser);

module.exports = router;
