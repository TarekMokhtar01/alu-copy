const Order = require('../models/order');
const User = require('../models/user');
const Perfume = require('../models/perfume');

exports.getCartItems = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('cart.items.perfume');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const cartItems = user.cart.items.map(item => ({
      perfume: item.perfume._id,
      name: item.perfume.name,
      price: item.perfume.price,
      quantity: item.quantity
    }));

    res.json({ items: cartItems });
  } catch (error) {
    console.error('Error getting cart items:', error);
    res.status(500).json({ error: 'Failed to get cart items' });
  }
};

exports.processCheckout = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('cart.items.perfume');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const subtotal = user.cart.items.reduce((total, item) => {
      return total + (item.perfume.price * item.quantity);
    }, 0);
    const shipping = 10.00; 
    const tax = subtotal * 0.1; 
    const totalAmount = subtotal + shipping + tax;

    const orderItems = user.cart.items.map(item => ({
      perfume: item.perfume._id,
      quantity: item.quantity,
      price: item.perfume.price
    }));

    const order = new Order({
      user: user._id,
      items: orderItems,
      shippingAddress: {
        fullName: req.body.fullName,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        zipCode: req.body.zipCode
      },
      paymentMethod: req.body.paymentMethod,
      paymentDetails: req.body.paymentMethod === 'credit_card' ? {
        cardNumber: req.body.cardNumber,
        cardHolderName: req.body.cardHolderName,
        expiryDate: req.body.expiryDate,
        cvv: req.body.cvv
      } : undefined,
      totalAmount
    });

    await order.save();

    user.cart.items = [];
    await user.save();

    res.status(201).json({
      message: 'Order placed successfully',
      orderId: order._id
    });
  } catch (error) {
    console.error('Error processing checkout:', error);
    res.status(500).json({ error: 'Failed to process checkout' });
  }
};

exports.getOrderDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate('user', 'name email')
      .populate('items.perfume');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error getting order details:', error);
    res.status(500).json({ error: 'Failed to get order details' });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.perfume')
      .sort({ orderDate: -1 });

    res.json(orders);
  } catch (error) {
    console.error('Error getting user orders:', error);
    res.status(500).json({ error: 'Failed to get user orders' });
  }
}; 