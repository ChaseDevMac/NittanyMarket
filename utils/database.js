require('dotenv').config();
const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'mariadb'
});

const testDB = async function () {
  try {
    await db.sequelize.authenticate();
    console.log('MariaDB connected');
  } catch (err) {
    console.error('Unable to connect to MariaDB', err);
  }
};

const db = {}

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.testDB = testDB;

module.exports = db;
