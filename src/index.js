const express = require("express");
const cors = require("cors");
require("dotenv").config(); // Load environment variables
const { connectDb } = require("./config/db"); // Import the DB connection function

const app = express();
app.use(express.json());
app.use(cors());

// Set up routes and middleware
app.get("/", (req, res) => {
    return res.status(200).send({ message: "Welcome to Ecommerce API - Node", status: true });
});


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

// Connect to database and start server
const PORT = process.env.PORT || 5454;
connectDb().then(() => {
    app.listen(PORT, () => {
        console.log("Ecommerce API listening on PORT:", PORT);
    });
}).catch(error => {
    console.error("Failed to connect to database:", error);
    process.exit(1); // Exit if unable to connect to the database
});

module.exports = app;







// -------------------------------------------------------------------------------------------






// const express = require("express")
// const cors = require("cors")
// const app=express()
// app.use(express.json())
// app.use(cors())
// import path from "path";

// app.get("/",(req,res)=>{
//     return res.status(200).send({message:" Welcome to Ecommerse api - node", status:true})
// })

// const authRouters = require("./routes/auth.route.js")
// app.use("/auth", authRouters)

// const userRouters = require("./routes/user.route.js");
// app.use("/api/users",userRouters);

// const productRouter = require("./routes/product.routes.js")
// app.use("/api/products", productRouter);

// const adminProductRouter=require("./routes/adminProduct.routes.js")
// app.use("/api/admin/products", adminProductRouter)

// const cartRouter = require("./routes/cart.routes.js");
// app.use("/api/cart", cartRouter)

// const cartItemRouter=require("./routes/cartItem.routes.js");
// app.use("/api/cart_items", cartItemRouter);

// const orderRouter = require("./routes/order.routes.js")
// app.use("/api/orders", orderRouter);

// const adminOrderRouter = require("./routes/adminOrder.routes.js");
// app.use("/api/admin/orders", adminOrderRouter);

// const reviewRouter = require("./routes/review.routes.js")
// app.use("/api/reviews", reviewRouter)

// const ratingRouter = require("./routes/rating.routes.js");
// app.use("/api/ratings", ratingRouter);

// const paymentRouter = require("./routes/payment.routes.js")
// app.use("/api/payments", paymentRouter);


// module.exports =app;




