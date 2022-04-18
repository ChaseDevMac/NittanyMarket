const express = require('express');
const path = require('path');
const app = express();
const ejsMate = require('ejs-mate');
const session = require('express-session');

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
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

const {testModels} = require('./utils/test_models');
app.get('/test', async (req, res) => {
  const result = await testModels();
  console.log(result);
  res.send(result);
})

//Middleware
app.use(express.urlencoded({extended: true}));
app.use(session(sessionConfig));
app.use((req, res, next) => {
  res.locals.user = req.session.email;
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
