const Order = require('../models/order');
const dateGenerator = require('random-date-generator');

module.exports.dateifyOrders = async function() {
  let startDate = new Date(2021, 6, 1);
  let endDate = new Date();
  try {
    const allOrders = await Order.findAll();
    for (let order of allOrders) {
      let dateifyDate = dateGenerator.getRandomDateInRange(startDate, endDate).toISOString().slice(0,10);
      console.log(dateifyDate);
      await Order.update({orderDate: dateifyDate }, {where: {transactionId: order.transactionId}});
    }
  } catch(err) {
    console.log(err)
  }
}
