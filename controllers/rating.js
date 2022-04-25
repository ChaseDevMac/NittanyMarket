const { Rating } = require('../models');

// display the rating form
module.exports.renderRating = (req, res) => {
  res.locals.sellerEmail = req.params.sellerEmail;
  res.render('ratings/create');
}

// post the rating of the seller
module.exports.postRating = async (req, res) => {
  const buyerEmail = req.session.email;
  const { sellerEmail } = req.params;
  const { rating, desc } = req.body.rating;

  try {
    await Rating.create({
      sellerEmail,
      buyerEmail,
      rating,
      desc,
      rateDate: new Date().toISOString().slice(0, 10), // remove time component
    });
    res.redirect('/mynm/orders');
  } catch (err) {
    console.log(err);
  }
}
