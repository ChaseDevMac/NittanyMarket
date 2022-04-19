const express = require('express');
const router = express.Router();

const authCtrl = require('../controllers/auth');
const { isLoggedIn } = require('../middleware/users');

router.route('/login')
  .get(isLoggedIn, authCtrl.loginForm)
  .post(authCtrl.login);

router.route('/register')
  .get(isLoggedIn, authCtrl.registerForm)
  .post(authCtrl.register);

module.exports = router;
