const { Op } = require('sequelize');
const { sequelize } = require('../utils/database');
const { Category, ProductListing, Seller, Rating } = require('../models/');

module.exports.showIndex = async (req, res) => {
  const categories = await Category.findAll({where: {parent: 'Root'}});

  const recentListings = await ProductListing.findAll({
    where: {quantity: {[Op.gt]: 0 }},
    order: [['postDate', 'DESC']],
    include: {
      model: Seller,
      attributes: ['email'],
    },
    limit: 20,
  });

  res.locals.categories = categories;
  res.locals.recentListings = recentListings;
  res.render('marketplace/index');
}

module.exports.showCategoryListings = async (req, res) => {
  const { category } = req.params;
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
    where: {category: category, [Op.and]: {quantity: {[Op.gt]: 0 }}},
    include: {
      model: Seller,
      attributes: ['email'],
    }
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
