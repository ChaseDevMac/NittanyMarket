const { ProductListing, Review } = require('../models');

module.exports.renderReview = async (req, res) => {
  const { listingId } = req.params;
  const listing = await ProductListing.findOne({where: {listingId: listingId}});
  res.locals.listing = listing;
  res.render('reviews/create');
}

module.exports.postReview = async (req, res) => {
  const email = req.session.email;
  const { listingId } = req.params;
  const { desc } = req.body.review;

  const listing = await ProductListing.findOne({where: {listingId: listingId}});
  try {
    await Review.create({
      sellerEmail: listing.sellerEmail,
      buyerEmail: email,
      listingId,
      desc,
    });
    res.redirect(`/listings/${listingId}`);
  } catch (err) {
    console.log(err);
  }
}
