const express = require('express');
const router = express.Router({mergeParams: true});

const reviewCtrl = require('../controllers/review');

router.get('/create', reviewCtrl.renderReview);

router.post('/', reviewCtrl.postReview);

module.exports = router;
