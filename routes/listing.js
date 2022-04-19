const express = require('express');
const router = express.Router();

const listingCtrl = require('../controllers/listing');
const { requiresSeller } = require('../middleware/users');

router.get('/create', requiresSeller, listingCtrl.renderListingForm);

router.post('/', requiresSeller, listingCtrl.createListing);

router.get('/:listingId', listingCtrl.showListing);

module.exports = router;
