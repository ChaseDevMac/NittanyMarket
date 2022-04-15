const express = require('express');
const path = require('path');
const app = express();
const ejsMate = require('ejs-mate');
const session = require('express-session');
const {Op} = require('sequelize');
const { sequelize } = require('./utils/database');

const Category = require('./models/category');
const ProductListing = require('./models/productlisting');
const Review = require('./models/review');

const PORT = 8080;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);

const sessionConfig = {
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // sameSite: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

//Middleware
app.use(express.urlencoded({extended: true}));
app.use(session(sessionConfig));
app.use((req, res, next) => {
  res.locals.user = req.session.email;
  next();
})

const db = require('./utils/database');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');

app.get('/', (req, res) => {
  res.render('home');
});

//routes
app.use('/', authRoutes);
app.use('/', userRoutes);

app.get('/marketplace', async (req, res) => {
  const categories = await Category.findAll({where: {parent: 'Root'}});
  res.locals.categories = categories;
  res.render('marketplace/root');
});

app.get('/marketplace/:category', async (req, res) => {
  const { category } = req.params;
  // const parentCategories = await Category.findAll({where: {child: category}}, {include: {all: true, nested: true}});
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
    parentCategories.push(parent.dataValues.cate_name);
  }
  res.locals.parentCategories = parentCategories.reverse();
  res.locals.childCategories = childCategories;
  res.locals.listings = listings;
  res.locals.currCategory = category;
  res.render('marketplace/category');
});

app.get('/listing/:listingId', async (req, res) => {
  const { listingId } = req.params;
  const listing = await ProductListing.findByPk(listingId);
  const reviews = await Review.findAll({where: {listingId: listingId}});
  res.locals.listing = listing;
  res.locals.reviews = reviews;
  res.render('marketplace/listings/show');
});

app.listen(PORT, (err) => {
  try {
    console.log(`Listening on ${PORT}`);
  } catch (err) {
    console.log('Error', err);
  }
});
