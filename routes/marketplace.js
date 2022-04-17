const express = require('express');
const router = express.Router();

const marketplaceCtrl = require('../controllers/marketplace');

router.get('/', marketplaceCtrl.showIndex);

router.get('/:category', marketplaceCtrl.showCategory);

module.exports = router
