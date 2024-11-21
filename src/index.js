const express = require("express");
const cors = require("cors");
require("dotenv").config(); // Load environment variables
const { connectDb } = require("./config/db"); // Import the DB connection function

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Root Route
app.get("/", (req, res) => {
    return res.status(200).send({ message: "Welcome to Ecommerce API - Node", status: true });
});

// Routes
const authRouters = require("./routes/auth.route.js");
app.use("/auth", authRouters);

const userRouters = require("./routes/user.route.js");
app.use("/api/users", userRouters);

const productRouter = require("./routes/product.routes.js");
app.use("/api/products", productRouter);

const adminProductRouter = require("./routes/adminProduct.routes.js");
app.use("/api/admin/products", adminProductRouter);

const cartRouter = require("./routes/cart.routes.js");
app.use("/api/cart", cartRouter);

const cartItemRouter = require("./routes/cartItem.routes.js");
app.use("/api/cart_items", cartItemRouter);

const orderRouter = require("./routes/order.routes.js");
app.use("/api/orders", orderRouter);

const adminOrderRouter = require("./routes/adminOrder.routes.js");
app.use("/api/admin/orders", adminOrderRouter);

const reviewRouter = require("./routes/review.routes.js");
app.use("/api/reviews", reviewRouter);

const ratingRouter = require("./routes/rating.routes.js");
app.use("/api/ratings", ratingRouter);

const paymentRouter = require("./routes/payment.routes.js");
app.use("/api/payments", paymentRouter);

// Database Connection
connectDb().catch((error) => {
    console.error("Failed to connect to database:", error.message);
    process.exit(1); // Exit if unable to connect to the database
});

// Export the app for Vercel
module.exports = app;
