const express = require('express');
const router = express.Router();

const listingCtrl = require('../controllers/listing');

router.get('/create', listingCtrl.renderListingForm);

router.post('/', listingCtrl.createListing);

router.get('/:listingId', listingCtrl.showListing);

module.exports = router;
