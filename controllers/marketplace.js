const { Op } = require('sequelize');
const { sequelize } = require('../utils/database');
const { Category, ProductListing } = require('../models/');

module.exports.showIndex = async (req, res) => {
  const categories = await Category.findAll({where: {parent: 'Root'}});
  res.locals.categories = categories;
  res.render('marketplace/index');
}

module.exports.showCategory = async (req, res) => {
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
  const listings = await ProductListing.findAll({where: {category: category, [Op.and]: {quantity: {[Op.gt]: 0 }}}});
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
