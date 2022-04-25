const { Op } = require('sequelize');
const { ProductListing, Cart, CartItem, Buyer, Address, Zipcode, Order, CreditCard } = require('../models');

// Add a desired item to the user's cart
module.exports.addToCart = async (req, res) => {
  const { listingId, sellerEmail } = req.body;
  const inStock = parseInt(req.body.inStock);
  const quantity = parseInt(req.body.quantity);

  // verify the desired quantity is valid
  if (quantity < 0 || (inStock < quantity)) {
    req.flash('error', 'invalid quantity');
    res.redirect(`/listings/${listingId}`);
  }
  try {
    const foundCart = await Cart.findByPk(req.session.cartId);

    // find if the item being added to the cart is already in the cart
    const foundCartItem = await CartItem.findOne({
      where: {
        [Op.and]: [
          {listingId},
          {cartId: foundCart.cartId}
        ]
      }
    });
    // if the item is not already in the cart insert it into database
    if (!foundCartItem) {
      await CartItem.create({
        cartId: foundCart.cartId,
        listingId,
        sellerEmail,
        quantity,
      });
    // if the item is already in the cart add additional quantity to it
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

// removes a desired item from the user's cart
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

// Display the cart's contents tied to that user
module.exports.showCart = async (req, res) => {
  try {
    // find the cart and its contents associated with the given user
    const foundCart = await Cart.findByPk(req.session.cartId, {
      include: {
        model: CartItem,
        attributes: ['cartId', 'listingId', 'quantity'],
        include: {
          model: ProductListing,
        }
      }
    });
    // format the way cart items are displayed and tally the total price of cart
    const cartItems = []
    let totalPrice = 0
    for (let cartItem of foundCart.CartItems) {
      cartItems.push({
        cartId: cartItem.cartId,
        listingId: cartItem.listingId,
        quantity: cartItem.quantity,
        title: cartItem.ProductListing.title,
        price: cartItem.ProductListing.price,
        subTotal: cartItem.quantity * cartItem.ProductListing.price,
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

// finds all the address information associated with a given buyer
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

// displays the checkout page
module.exports.showCheckout = async (req, res) => {
  const email = req.session.email;
  const buyerInfo = await getFullBuyerInfo(email);

  // only send the last four digits of credit card number
  const creditCard = await CreditCard.findOne({where: {owner: email}});
  creditCard.dataValues.ccn = '****' + creditCard.dataValues.ccn.slice(-4);

  res.locals.totalPrice = req.query.totalPrice;
  res.locals.creditCard = creditCard;
  res.locals.buyerInfo = buyerInfo;
  res.render('cart/checkout');
};

// triggered when the user places their order
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
    // verify the quantity of each cart item is still valid
    for (let cartItem of foundCart.CartItems) {
      const qtyDiff = cartItem.ProductListing.quantity - cartItem.quantity;
      if ( qtyDiff < 0 ) {
        req.flash('error', `Please remove ${Math.abs(qtyDiff)} ${cartItem.ProductListing.title}`);
        return res.redirect('/cart');
      }
    }
    // for each cart item, create a new order
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

      // update the quantity of the listing
      await listing.update({quantity: newStock});
      await listing.save();

      // remove the cart item from the cart
      await cartItem.destroy();
    }
    req.flash('success', 'Your order has been placed!');
    res.redirect('/mynm/orders');
  } catch (err) {
    console.log(err);
  }
};
