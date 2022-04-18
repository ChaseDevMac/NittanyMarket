const ProductListing = require('../models/productlisting');

module.exports.floatifyPrices = async function() {
  try {
    const allListings = await ProductListing.findAll();
    for (let listing of allListings) {
      let floatPrice = listing.price.replace('$', '');
      ProductListing.update({price: floatPrice}, {where: {listingId: listing.listingId}})
    }
    return allListings;
  } catch (err) {
    console.log(err);
  }
}
