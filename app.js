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

// const {testModels} = require('./utils/test_models');
// const { floatifyPrices } = require('./utils/floatify_prices');
app.get('/test', async (req, res) => {
  // const result = await testModels();
  // const result2 = await floatifyPrices();
  // res.send(result2);
})

//Middleware
app.use(express.urlencoded({extended: true}));
app.use((req, res, next) => {
  res.locals.user = req.session.email;
  res.locals.isBuyer = req.session.isBuyer;
  res.locals.isSeller = req.session.isSeller;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})

const authRoutes = require('./routes/auth');
const mynmRoutes = require('./routes/mynm');
const listingRoutes = require('./routes/listing');
const marketplaceRoutes = require('./routes/marketplace');

//routes
app.use('/', authRoutes);
app.use('/mynm', mynmRoutes);
app.use('/listings', listingRoutes);
app.use('/marketplace', marketplaceRoutes);

app.get('/', (req, res) => {
  res.render('home');
});

app.listen(PORT, (err) => {
  try {
    console.log(`Listening on ${PORT}`);
  } catch (err) {
    console.log('Error', err);
  }
});
