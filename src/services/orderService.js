const Address = require("../models/address.model.js");
const Order = require("../models/order.model.js");
const Product = require("../models/product.model.js");
const cartService = require("../services/cart.service.js");
const OrderItem = require("../models/orderItems.js")
// async function createOrder(user, shippAddress) {
//   let address;

//   if (shippAddress._id) {
//     let existAddress = await Address.findById(shippAddress._id);
//     address = existAddress;
//   } else {
//     address = new Address(shippAddress);
//     address.user = user;
//     await address.save();
//     console.log("user.address", user.address)
//     user.address.push(address);
//     await user.save();
//   }
//   const cart = await cartService.findUserCart(user._id);
//   const orderItems = [];

//   for (const item of cart.cartItems) {
//     const orderItem = new OrderItem({
//       price: item.price,
//       product: item.product,
//       quantity: item.quantity,
//       size: item.size,
//       userId: item.userId,
//       discountedPrice: item.discountedPrice,
//     });

//     const createdOrderItem = await orderItem.save();
//     orderItems.push(createdOrderItem);
//   }
//   const createdOrder = new Order({
//     user,
//     orderItems,
//     totalPrice: cart.totalPrice,
//     totalDiscountedPrice: cart.totalDiscountedPrice,
//     discount: cart.discount,
//     totalItem: cart.totalItem,
//     shippAddress: address,
//   });
//   const savedOrder = await createdOrder.save();
//   return savedOrder;
// }

async function createOrder(user, shippAddress) {
  let address;

  // Ensure shipping address is created or retrieved
  if (shippAddress._id) {
      address = await Address.findById(shippAddress._id);
  } else {
      address = new Address(shippAddress);
      address.user = user;
      await address.save();

      // Ensure `user.address` is an array and correctly referenced
      if (!Array.isArray(user.address)) {
          user.address = [];
      }

      user.address.push(address); // Use `user.address` as per user model
      await user.save();
  }

  // Retrieve the cart with populated `cartItems`
  const cart = await cartService.findUserCart(user._id);
  const orderItems = [];

  // Process each cart item and create an order item
  for (const item of cart.cartItems) {
      console.log("Processing Cart Item:", item); // Log each cart item for debugging

      const orderItem = new OrderItem({
          price: item.price,
          product: item.product ? item.product._id : undefined,
          quantity: item.quantity,
          size: item.size,
          userId: user._id,
          discountedPrice: item.discountedPrice,
      });

      const createdOrderItem = await orderItem.save();
      orderItems.push(createdOrderItem);
  }

  // Create the final order with all required fields
  const createdOrder = new Order({
      user: user._id,
      orderItems,
      totalPrice: cart.totalPrice,
      totalDiscountedPrice: cart.totalDiscountedPrice,
      discount: cart.discount,
      totalItem: cart.totalItem,
      shippingAddress: address, // Ensure consistency in naming
  });

  const savedOrder = await createdOrder.save();
  return savedOrder;
}

async function placeOrder(orderId) {
  const order = await findOrderById(orderId);

  order.orderStatus = "PLACED";
  order.paymentDetails.status = "COMPLETED";

  return await order.save();
}
async function confirmedOrder(orderId) {
  const order = await findOrderById(orderId);

  order.orderStatus = "CONFIRMED";

  return await order.save();
}
async function shipOrder(orderId) {
  const order = await findOrderById(orderId);

  order.orderStatus = "SHIPPED";

  return await order.save();
}
async function deliverOrder(orderId) {
  const order = await findOrderById(orderId);

  order.orderStatus = "DELIVERED";

  return await order.save();
}
async function cancelledOrder(orderId) {
  const order = await findOrderById(orderId);

  order.orderStatus = "CANCELED";

  return await order.save();
}

// async function findOrderById(orderId) {
//   const order = await Order.findById(orderId)
//     .populate("user")
//     .populate({ path: "orderItems", populate: { path: "product" } })
//     .populate("shippingAddress");

//   return order;
// }

async function findOrderById(orderId) {
  try {
      const order = await Order.findById(orderId)
          .populate("user")
          .populate({ path: "orderItems", populate: { path: "product" } })
          .populate("shippingAddress");

      if (!order) {
          throw new Error("Order not found with ID " + orderId);
      }

      console.log("Order with populated products:", JSON.stringify(order, null, 2)); // Log for debugging
      return order;
  } catch (error) {
      console.error("Error finding order by ID:", error.message);
      throw new Error(error.message);
  }
}


async function usersOrderHistory(userId) {
  try {
    const orders = await Order.find({ user: userId, orderStatus: "PLACED" })
      .populate({ path: "orderItems", populate: { path: "product" } })
      .lean();
    return orders;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function getAllOrders() {
  return await Order.find()
    .populate({ path: "orderItems", populate: { path: "product" } })
    .lean();
}

async function deleteOrder(orderId) {
  const order = await findOrderById(orderId);
  await Order.findByIdAndDelete(order._id);
}

module.exports = {
  createOrder,
  placeOrder,
  confirmedOrder,
  shipOrder,
  deliverOrder,
  cancelledOrder,
  findOrderById,
  usersOrderHistory,
  getAllOrders,
  deleteOrder,
};
