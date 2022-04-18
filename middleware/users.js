module.exports.isLoggedIn = async function (req, res, next) {
  if (!req.session.email) {
    return res.redirect('/login');
  }
  next();
};

module.exports.isSeller = async function (req, res, next) {
  if (!req.session.isSeller) {
    return res.redirect('/marketplace');
  }
  next();
}

module.exports.isBuyer = async function (req, res, next) {
  if (!req.session.isBuyer) {
    return res.redirect('/marketplace');
  }
  next();
}
