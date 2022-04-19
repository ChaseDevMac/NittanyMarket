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

// const {testModels} = require('./utils/test_models');
// const { floatifyPrices } = require('./utils/floatify_prices');
// const { dateifyRatings } = require('./utils/dateify');
app.get('/test', async (req, res) => {
  // await dateifyRatings();
  res.send('ok')
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
});

const { Order, ProductListing, Review, Rating, Address, Buyer, Zipcode, CreditCard } = require('./models');

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

app.get('/listings/:listingId/reviews/create', async (req, res) => {
  const { listingId } = req.params;
  const listing = await ProductListing.findOne({where: {listingId: listingId}});
  res.locals.listing = listing;
  console.log(listing.title);
  res.render('reviews/create');
});

app.post('/listings/:listingId/reviews', async (req, res) => {
  const email = req.session.email;
  const { listingId } = req.params;
  const { desc } = req.body.review;

  const listing = await ProductListing.findOne({where: {listingId: listingId}});
  try {
    await Review.create({
      sellerEmail: listing.sellerEmail,
      buyerEmail: email,
      listingId,
      desc,
    });
    res.redirect(`/listings/${listingId}`);
  } catch (err) {
    console.log(err);
  }
});

app.get('/users/:sellerEmail/ratings/create', (req, res) => {
  res.locals.sellerEmail = req.params.sellerEmail;
  res.render('ratings/create');
});

app.post('/users/:sellerEmail/ratings', async (req, res) => {
  const buyerEmail = req.session.email;
  const { sellerEmail } = req.params;
  const { rating, desc } = req.body.rating;

  try {
    await Rating.create({
      sellerEmail,
      buyerEmail,
      rating,
      desc,
      rateDate: new Date().toISOString().slice(0, 10),
    });
  } catch (err) {
    console.log(err);
  }
  res.redirect('/mynm/orders');
});

app.get('/cart', async (req, res) => {
  const { listingId, quantity } = req.query;
  const listing = await ProductListing.findOne({where: {listingId: listingId}});

  res.locals.listing = listing;
  res.locals.quantity = quantity;
  res.locals.totalPrice = listing.price * quantity;
  res.render('cart/index');
});

async function getFullBuyerInfo(email) {
  const result = await Buyer.findByPk(email, {
    attributes: ['firstName', 'lastName'],
    include: [{
      model: Address,
      as: 'homeAddress',
      attributes: ['streetNum', 'streetName'],
      include: {
        model: Zipcode,
        attributes: ['zipcode', 'city', 'stateId']
      }
    }, { 
      model: Address,
      as: 'billAddress',
      attributes: ['streetNum', 'streetName'],
      include: {
        model: Zipcode,
        attributes: ['zipcode', 'city', 'stateId']
      }
    }]
  });
  return result;
}

app.get('/cart/checkout', async (req, res) => {
  const { listingId, quantity, totalPrice } = req.query;
  const listing = await ProductListing.findOne({where: {listingId: listingId}});

  const email = req.session.email;
  const buyerInfo = await getFullBuyerInfo(email);
  const creditCard = await CreditCard.findOne({where: {owner: email}});
  creditCard.dataValues.ccn = '****' + creditCard.dataValues.ccn.slice(-4);

  res.locals.listing = listing;
  res.locals.totalPrice = totalPrice;
  res.locals.quantity = quantity;
  res.locals.creditCard = creditCard;
  res.locals.buyerInfo = buyerInfo;
  res.render('cart/checkout');
});

app.post('/cart/checkout', async (req, res) =>{
  const buyerEmail = req.session.email;
  const { listingId, quantity, totalPrice } = req.body;
  const transactionId = Math.floor(Math.random() * 1111111111);
  const listing = await ProductListing.findOne({where: {listingId: listingId}});
  const newStock = listing.quantity - quantity;

  await Order.create({
    transactionId,
    sellerEmail: listing.sellerEmail,
    listingId,
    buyerEmail,
    quantity,
    payment: totalPrice,
    orderDate: new Date().toISOString().slice(0, 10),
  });

  await ProductListing.update({quantity: newStock}, {where: {listingId: listingId}});
  req.flash('success', 'Your order has been placed!');
  res.redirect('/mynm/orders');
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
