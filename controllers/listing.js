const { sequelize } = require('../utils/database');
const { Category, ProductListing, Review, Rating } = require('../models/');

module.exports.renderListingForm = async (req, res) => {
  const categories = await Category.findAll();
  const allCategories = [];
  for (let category of categories) {
    categoryName = category.dataValues.child;
    if (categoryName !== 'Root') {
      allCategories.push(categoryName);
    }
  }
  res.locals.categories = allCategories.sort();
  res.render('listings/create');
}

module.exports.createListing = async (req, res) => {
  const sellerEmail = req.session.email;
  const listing = req.body.listing;
  const listingId = Math.floor(Math.random() * 11111111);
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

module.exports.showListing = async (req, res) => {
  const { listingId } = req.params;
  const listing = await ProductListing.findOne({where: {listingId: listingId}});
  const reviews = await Review.findAll({where: {listingId: listingId}});
  const sellerRating = await Rating.findAll({
    where: {sellerEmail: listing.sellerEmail}, 
    attributes: [[sequelize.fn('avg', sequelize.col('rating')), 'avgRating']]
  });

  res.locals.listing = listing;
  res.locals.reviews = reviews;
  res.locals.sellerRating = sellerRating[0].dataValues.avgRating;
  res.render('listings/show');
}

module.exports.deleteListing = async (req, res) => {
  const { listingId } = req.params;
  const listing = await ProductListing.findOne({where: {listingId: listingId}});
  await listing.update({removeDate: new Date().toISOString().replace('T', ' ')});
  res.redirect('/mynm/listings');
}

module.exports.renderEditForm = async (req, res) => {
  res.locals.listing = await ProductListing.findOne({where: {listingId: req.params.listingId}});
  res.render('listings/edit');
}

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
