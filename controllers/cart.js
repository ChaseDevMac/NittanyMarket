const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const { ProductListing, Cart, CartItem, Buyer, Address, Zipcode, Order, CreditCard } = require('../models');

module.exports.addToCart = async (req, res) => {
  const email = req.session.email;
  const listingId = req.body.listingId;
  const quantity = parseInt(req.body.quantity);
  if (quantity < 0) {
    req.flash('error', 'invalid quantity');
    res.redirect(`/listings/${listingId}`);
  }
  try {
    const listing = await ProductListing.findOne({where: {listingId}});
    let foundCart = await Cart.findOne({where: {email}});
    if (!foundCart) foundCart = await Cart.create({ cartId: uuidv4(), email});

    const foundCartItem = await CartItem.findOne({
      where: {
        [Op.and]: [
          {listingId},
          {cartId: foundCart.cartId}
        ]
      }
    });
    if (!foundCartItem) {
      await CartItem.create({
        cartId: foundCart.cartId,
        listingId,
        sellerEmail: listing.sellerEmail,
        quantity,
      });
    } else {
      const updatedQty = foundCartItem.dataValues.quantity + quantity;
      CartItem.update({quantity: updatedQty}, {
        where: {
          [Op.and] : [
            { cartId: foundCart.dataValues.cartId },
            { listingId }
          ]
        }
      });
    }
    res.redirect('/cart');
  } catch (err) {
    console.log(err);
  }
};

module.exports.removeCartItem = async (req, res) => {
  const { cartItem } = req.body;
  await CartItem.destroy({
    where: {
      cartId: cartItem.cartId,
      listingId: cartItem.listingId,
    }
  });
  res.redirect('/cart');
}

module.exports.showCart = async (req, res) => {
  const email = req.session.email;
  try {
    const foundCart = await Cart.findOne({
      where: {email},
      include: {
        model: CartItem,
        attributes: ['cartId', 'listingId', 'quantity'],
        include: {
          model: ProductListing,
        }
      }
    });
    const cartItems = []
    let totalPrice = 0
    for (let cartItem of foundCart.CartItems) {
      cartItems.push({
        cartId: cartItem.cartId,
        listingId: cartItem.listingId,
        quantity: cartItem.quantity,
        title: cartItem.ProductListing.title,
        price: cartItem.ProductListing.price,
      });
      totalPrice += cartItem.ProductListing.price * cartItem.quantity;
    }
    res.locals.cartItems = cartItems;
    res.locals.totalPrice = totalPrice;
    res.render('cart/index');
  } catch (err) {
    console.log(err);
  }
};

async function getFullBuyerInfo(email) {
  const result = await Buyer.findByPk(email, {
    attributes: ['firstName', 'lastName'],
    include: [{
      model: Address,
      as: 'homeAddress',
      attributes: ['streetNum', 'streetName'],
      include: {
        model: Zipcode,
        attributes: ['zipcode', 'city', 'stateId']
      }
    }, { 
      model: Address,
      as: 'billAddress',
      attributes: ['streetNum', 'streetName'],
      include: {
        model: Zipcode,
        attributes: ['zipcode', 'city', 'stateId']
      }
    }]
  });
  return result;
}

module.exports.showCheckout = async (req, res) => {
  const email = req.session.email;
  const buyerInfo = await getFullBuyerInfo(email);
  const creditCard = await CreditCard.findOne({where: {owner: email}});
  creditCard.dataValues.ccn = '****' + creditCard.dataValues.ccn.slice(-4);

  res.locals.totalPrice = req.query.totalPrice;
  res.locals.creditCard = creditCard;
  res.locals.buyerInfo = buyerInfo;
  res.render('cart/checkout');
};

module.exports.checkout = async (req, res) =>{
  const buyerEmail = req.session.email;
  try {
    const foundCart = await Cart.findOne({
      where: {email: buyerEmail},
      include: {
        model: CartItem,
        include: { model: ProductListing }
      },
    });
    for (let cartItem of foundCart.CartItems) {
      const qtyDiff = cartItem.ProductListing.quantity - cartItem.quantity;
      if ( qtyDiff < 0 ) {
        req.flash('error', `Please remove ${Math.abs(qtyDiff)} ${cartItem.ProductListing.title}`);
        return res.redirect('/cart');
      }
    }
    for (let cartItem of foundCart.CartItems) {
      const transactionId = Math.floor(Math.random() * 1111111111);
      const listing = cartItem.ProductListing;
      const newStock = listing.quantity - cartItem.quantity;

      await Order.create({
        transactionId,
        sellerEmail: listing.sellerEmail,
        listingId: cartItem.listingId,
        buyerEmail,
        quantity: cartItem.quantity,
        payment: listing.price * cartItem.quantity,
        orderDate: new Date().toISOString().replace('T', ' '),
      });

      await listing.update({quantity: newStock});
      await listing.save();

      await cartItem.destroy();

      req.flash('success', 'Your order has been placed!');
      res.redirect('/mynm/orders');
    }
  } catch (err) {
    console.log(err);
  }
};
