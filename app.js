const express = require('express');
const path = require('path');
const app = express();
const ejsMate = require('ejs-mate');
const session = require('express-session');

const Category = require('./models/category');
const { sequelize } = require('./utils/database');

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
  console.log(categories);
  res.render('marketplace/category');
});

app.get('/marketplace/:category', async (req, res) => {
  const { category } = req.params;
  res.send(category);
});

app.listen(PORT, (err) => {
  try {
    console.log(`Listening on ${PORT}`);
  } catch (err) {
    console.log('Error', err);
  }
});
