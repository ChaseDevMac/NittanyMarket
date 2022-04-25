const { sequelize } = require('../utils/database');
const { Category, ProductListing, Review, Rating } = require('../models/');

// display the product listing creation form
module.exports.renderListingForm = async (req, res) => {
  // find all the categories for dropdown menu
  const categories = await Category.findAll();
  const allCategories = [];
  for (let category of categories) {
    categoryName = category.dataValues.child;
    if (categoryName !== 'Root') {
      allCategories.push(categoryName);
    }
  }
  // sort the categories alphanumerically
  res.locals.categories = allCategories.sort();
  res.render('listings/create');
}

// insert a new listing into database
module.exports.createListing = async (req, res) => {
  const sellerEmail = req.session.email;
  const listing = req.body.listing;
  const listingId = Math.floor(Math.random() * 11111111); // generate a random new listingId
  const newListing = await ProductListing.create({
    sellerEmail,
    listingId,
    title: listing.title,
    category: listing.category,
    productName: listing.name,
    productDesc: listing.desc,
    price: listing.price,
    quantity: listing.quantity,
    postDate: new Date().toISOString().slice(0,10),
  });
  res.redirect(`/listings/${newListing.listingId}`);
}

// display a product listing
module.exports.showListing = async (req, res) => {
  const { listingId } = req.params;
  const listing = await ProductListing.findOne({where: {listingId: listingId}});

  // find all the reviews associated with this product listing
  const reviews = await Review.findAll({where: {listingId: listingId}});

  // find the average rating for the given seller
  const sellerRating = await Rating.findAll({
    where: {sellerEmail: listing.sellerEmail}, 
    attributes: [[sequelize.fn('avg', sequelize.col('rating')), 'avgRating']]
  });

  res.locals.listing = listing;
  res.locals.reviews = reviews;
  res.locals.sellerRating = sellerRating[0].dataValues.avgRating;
  res.render('listings/show');
}

// delete a product listing
module.exports.deleteListing = async (req, res) => {
  const { listingId } = req.params;
  const listing = await ProductListing.findOne({where: {listingId: listingId}});
  await listing.update({removeDate: new Date().toISOString().replace('T', ' ')});
  res.redirect('/mynm/listings');
}

// render the form for editing a product listing
module.exports.renderEditForm = async (req, res) => {
  res.locals.listing = await ProductListing.findOne({where: {listingId: req.params.listingId}});
  res.render('listings/edit');
}

// edit a listing with the new information
module.exports.editListing = async (req, res) => {
  const { listingId } = req.params;
  const editListing = req.body.listing;
  const listing = await ProductListing.findOne({where: {listingId: listingId}});
  await listing.update({
    title: editListing.title,
    productName: editListing.name,
    productDesc: editListing.desc,
    quantity: editListing.quantity,
    price: editListing.price
  });
  res.redirect(`/listings/${listingId}`);
}
