const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

router.get('/:email', userCtrl.renderUser);

module.exports = router;
