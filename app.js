const express = require('express');
const path = require('path');
const app = express();
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const redis = require('redis');
const redisClient = redis.createClient({ legacyMode: true });
const redisStore = require('connect-redis')(session);
redisClient.connect();

const PORT = 8080;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.engine('ejs', ejsMate);

redisClient.on('error', (err) => {
  console.log('Redis Error: ', err);
});

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

//Middleware
app.use(express.urlencoded({extended: true}));
app.use((req, res, next) => {
  res.locals.user = req.session.email;
  res.locals.isBuyer = req.session.isBuyer;
  res.locals.isSeller = req.session.isSeller;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

const authRoutes = require('./routes/auth');
const mynmRoutes = require('./routes/mynm');
const listingRoutes = require('./routes/listing');
const reviewRoutes = require('./routes/review');
const ratingRoutes = require('./routes/rating');
const marketplaceRoutes = require('./routes/marketplace');
const cartRoutes = require('./routes/cart');
const userRoutes = require('./routes/user');

//routes
app.use('/', authRoutes);
app.use('/mynm', mynmRoutes);
app.use('/listings', listingRoutes);
app.use('/marketplace', marketplaceRoutes);
app.use('/listings/:listingId/reviews', reviewRoutes);
app.use('/users/:sellerEmail/ratings', ratingRoutes);
app.use('/cart', cartRoutes);
app.use('/users', userRoutes);

app.get('/', (req, res) => {
  res.render('home');
});

app.all('*', (req, res) => {
  res.render('not_found');
});

app.listen(PORT, (err) => {
  try {
    console.log(`Listening on ${PORT}`);
  } catch (err) {
    console.log('Error', err);
  }
});
