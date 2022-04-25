const { Op } = require('sequelize');
const { sequelize } = require('../utils/database');
const { Category, ProductListing, Seller, Rating } = require('../models/');

// display the marketplace 'home' page
module.exports.showIndex = async (req, res) => {
  // find 20 most recent product listings
  const recentListings = await ProductListing.findAll({
    where: {
      quantity: {[Op.gt]: 0 },
      removeDate: {[Op.is]: null},
    },
    order: [['postDate', 'DESC']],
    include: {
      model: Seller,
      attributes: ['email'],
    },
    limit: 20,
  });

  res.locals.categories = await Category.findAll({where: {parent: 'Root'}});
  res.locals.listings = recentListings;
  res.locals.listingsType = 'Recently Posted';
  res.render('marketplace/index');
}

module.exports.showCategoryListings = async (req, res) => {
  const { category } = req.params;
  // find all the parent categories of the current category
  const parentCategoriesQuery = await sequelize.query(`WITH RECURSIVE Parents AS
    (SELECT * FROM Categories
    WHERE cate_name = '${category}'
    UNION
    SELECT C.*
    FROM Categories C, Parents P
    WHERE C.cate_name = P.parent_cate)
    SELECT * FROM Parents`, {model: Category});

  // find all child categories associated with a current category
  const childCategories = await Category.findAll({where: {parent: category}});

  // Find all the product listings under the current category
  const listings = await ProductListing.findAll({
    where: {
      category,
      quantity: {[Op.gt]: 0 },
      removeDate: {[Op.is]: null},
    },
    include: {
      model: Seller,
      attributes: ['email'],
    }
  });

  // filter the parentCategories to exclude the 'Root' category
  const parentCategories = [];
  for (let parent of parentCategoriesQuery) {
    if (parent.dataValues.cate_name !== 'Root') {
      parentCategories.push(parent.dataValues.cate_name);
    }
  }
  res.locals.parentCategories = parentCategories.reverse(); // reverse the parent categories for bread crumb
  res.locals.childCategories = childCategories;
  res.locals.listings = listings;
  res.locals.currCategory = category;
  res.render('marketplace/show');
}

// search all product listings (without a category filter)
module.exports.searchIndex = async (req, res) => {
  const { q } = req.query;
  const queryListings = await ProductListing.findAll({
    where: {
      title: { [Op.substring]: q },
      quantity: {[Op.gt]: 0 },
      removeDate: {[Op.is]: null},
    },
    include: {
      model: Seller,
      attributes: ['email'],
    },
  });
  res.locals.listings = queryListings;
  res.locals.listingsType = q;
  res.locals.categories = await Category.findAll({where: {parent: 'Root'}});
  res.render('marketplace/index');
};

// search product listings under the current category
module.exports.searchCategoryListings = async (req, res) => {
  const { category } = req.params;
  const { q } = req.query;
  const parentCategoriesQuery = await sequelize.query(`WITH RECURSIVE Parents AS
    (SELECT * FROM Categories
    WHERE cate_name = '${category}'
    UNION
    SELECT C.*
    FROM Categories C, Parents P
    WHERE C.cate_name = P.parent_cate)
    SELECT * FROM Parents`, {model: Category});
  const childCategories = await Category.findAll({where: {parent: category}});
  const listings = await ProductListing.findAll({
    where: {
      title: { [Op.substring]: q },
      quantity: {[Op.gt]: 0 },
      removeDate: {[Op.is]: null},
      category,
    },
    include: {
      model: Seller,
      attributes: ['email'],
    },
  });
  const parentCategories = [];
  for (let parent of parentCategoriesQuery) {
    if (parent.dataValues.cate_name !== 'Root') {
      parentCategories.push(parent.dataValues.cate_name);
    }
  }
  res.locals.parentCategories = parentCategories.reverse();
  res.locals.childCategories = childCategories;
  res.locals.listings = listings;
  res.locals.currCategory = category;
  res.render('marketplace/show');
}
