const express = require('express');
const router = express.Router({mergeParams: true});

const ratingCtrl = require('../controllers/rating');

router.get('/create', ratingCtrl.renderRating);

router.post('/', ratingCtrl.postRating);

module.exports = router;
