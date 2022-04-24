module.exports.requiresLogin = async function (req, res, next) {
  if (!req.session.email) {
    req.session.returnTo = req.originalUrl;
    return res.redirect('/login');
  }
  next();
};

module.exports.isLoggedIn = async function (req, res, next) {
  if (req.session.email) {
    return res.redirect('/');
  }
  next();
}

module.exports.requiresSeller = async function (req, res, next) {
  if (!req.session.isSeller) {
    req.flash('error', 'You need to apply to become a seller');
    return res.redirect('/users/seller-app');
  }
  next();
}

module.exports.isBuyer = async function (req, res, next) {
  if (req.session.isBuyer) {
    req.session.returnTo = req.originalUrl;
    return res.redirect('/');
  }
  next();
}

module.exports.requiresBuyer = async function (req, res, next) {
  if (!req.session.isBuyer) {
    req.flash('error', 'You need to finish completing your account setup');
    return res.redirect('/users/become-a-buyer');
  }
  next();
}

module.exports.isSeller = async function (req, res, next) {
  if (req.session.isSeller) {
    req.session.returnTo = req.originalUrl;
    return res.redirect('/');
  }
  next();
}
