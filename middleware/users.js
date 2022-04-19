module.exports.requiresLogin = async function (req, res, next) {
  if (!req.session.email) {
    req.flash('error', 'You must be logged in!');
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
    req.flash('error', 'You need a seller account type!');
    return res.redirect('/');
  }
  next();
}

module.exports.requiresBuyer = async function (req, res, next) {
  if (!req.session.isBuyer) {
    req.flash('error', 'You need a buyer account type!');
    return res.redirect('/');
  }
  next();
}
