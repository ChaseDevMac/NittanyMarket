const express = require('express');
const router = express.Router();

const listingCtrl = require('../controllers/listing');
const { requiresSeller } = require('../middleware/users');

router.get('/create', requiresSeller, listingCtrl.renderListingForm);

router.post('/', requiresSeller, listingCtrl.createListing);

router.route('/:listingId')
  .get(listingCtrl.showListing)
  .delete(listingCtrl.deleteListing);

module.exports = router;
