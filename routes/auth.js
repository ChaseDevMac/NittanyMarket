const express = require('express');
const router = express.Router();

const authCtrl = require('../controllers/auth');

router.route('/login')
  .get(authCtrl.loginForm)
  .post(authCtrl.validateLogin, authCtrl.login);

router.route('/register')
  .get(authCtrl.registerForm)
  .post(authCtrl.register);

module.exports = router;
