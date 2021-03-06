const express = require('express');
const path = require('path');
const app = express();
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const redis = require('redis');
const redisClient = redis.createClient({ legacyMode: true });
const redisStore = require('connect-redis')(session);
redisClient.connect();

const { Category } = require('./models');

const PORT = 8080;

app.engine('html', ejsMate);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

redisClient.on('error', (err) => {
  console.log('Redis Error: ', err);
});

// configuration object for handling sessions
const sessionConfig = {
  secret: 'PennStateIsBetterThanNittanyState',
  resave: false,
  saveUninitialized: true,
  store: new redisStore({
    host: 'localhost',
    port: 6379,
    client: redisClient,
    ttl: 86400,
  }),
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());

app.use(express.urlencoded({extended: true}));
// All the session information stored in Redis
app.use((req, res, next) => {
  res.locals.user = req.session.email;
  res.locals.isBuyer = req.session.isBuyer;
  res.locals.isSeller = req.session.isSeller;
  res.locals.cartId = req.session.cartId;
  res.locals.returnTo = req.originalUrl;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// import all routes
const authRoutes = require('./routes/auth');
const mynmRoutes = require('./routes/mynm');
const listingRoutes = require('./routes/listing');
const reviewRoutes = require('./routes/review');
const ratingRoutes = require('./routes/rating');
const marketplaceRoutes = require('./routes/marketplace');
const cartRoutes = require('./routes/cart');
const userRoutes = require('./routes/user');

// routes
app.use('/', authRoutes);
app.use('/mynm', mynmRoutes);
app.use('/listings', listingRoutes);
app.use('/marketplace', marketplaceRoutes);
app.use('/listings/:listingId/reviews', reviewRoutes);
app.use('/users/:sellerEmail/ratings', ratingRoutes);
app.use('/cart', cartRoutes);
app.use('/users', userRoutes);

// render home page with categories
app.get('/', async (req, res) => {
  const categories = await Category.findAll({where: {parent: 'Root'}});
  res.locals.categories = categories;
  res.render('home');
});

// catch-all for any requested pages that don't exist
app.all('*', (req, res) => {
  res.render('not_found');
});

// port for the server to listen to
app.listen(PORT, (err) => {
  try {
    console.log(`Listening on ${PORT}`);
  } catch (err) {
    console.log('Error', err);
  }
});
