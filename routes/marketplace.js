const express = require('express');
const router = express.Router();

const marketplaceCtrl = require('../controllers/marketplace');

router.get('/', marketplaceCtrl.showIndex);

router.get('/search', marketplaceCtrl.searchIndex);

router.get('/:category', marketplaceCtrl.showCategoryListings);

router.get('/:category/search', marketplaceCtrl.searchCategoryListings);

module.exports = router;
