const User = require('../models/user');
const bcrypt = require('bcrypt');

module.exports.validateLogin = async function (req, res, next) {
  const { email, password } = req.body.user;
  const foundUser = await User.findByPk(email);
  if (!foundUser)
    return res.send('Wrong password or email');
  const comparePassword = bcrypt.compareSync(password, foundUser.password);
  if (!comparePassword)
    return res.send('Wrong password or email');
  next();
};

module.exports.loginForm = (req, res) => {
  res.render('users/login');
};

module.exports.login = (req, res) => {
  req.session.email = req.body.user.email;
  res.redirect('/');
};

module.exports.registerForm = (req, res) => {
  res.render('users/register');
};

module.exports.register = async (req, res) => {
  try {
    const { email, password } = req.body.user;
    const hashPass = bcrypt.hashSync(password, 12);
    const newUser = User.build({ email, password: hashPass });
    await newUser.save();
    req.session.email = newUser.email;
    return res.redirect('/');
  } catch (err) {
    console.log(err);
    res.send('Error');
  }
}
