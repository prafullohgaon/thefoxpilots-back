// const express = require("express")
// const cors = require("cors")
// const app=express()
// app.use(express.json())
// app.use(cors())

// app.use(cors(
//     {
//         origin:["https://deploy-mern-1whq.vercel.app"],
//         methods:["POST", "GET"],

//         credentials: true
//     }
// ));
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
// module.exports =app;


const express = require("express");
const cors = require("cors");
const { connectDb } = require("./config/db"); // import your db config

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["https://deploy-mern-1whq.vercel.app"],
    methods: ["POST", "GET"],
    credentials: true,
  })
);

// Connect to DB
connectDb().then(() => console.log("Database connected successfully"));

app.get("/", (req, res) => {
  return res
    .status(200)
    .send({ message: "Welcome to Ecommerse api - node", status: true });
});

// Your routes here
const authRouters = require("./routes/auth.route.js");
app.use("/auth", authRouters);

// ... other routes

module.exports = app;

