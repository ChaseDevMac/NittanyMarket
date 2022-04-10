const db = require('../utils/database');
const User = require('../models/users');
const bcrypt = require('bcrypt');

const hashPassword = async function() {
  try {
    const allUsers = await User.findAll();
    const saltRounds = 12;
    for (let user of allUsers) {
      let currPassword = user.password;
      let hashPassword = bcrypt.hashSync(currPassword, saltRounds);
      await User.update({password: hashPassword }, {where: {email: user.email}});
    }
  } catch(err) {
    console.log(err)
  }
}

hashPassword();
