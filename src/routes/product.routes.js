const express = require("express")
const router = express.Router();

const productController = require("../controller/product.controller.js")
const authenticate = require("../middleware/authenticate.js");

router.get("/",authenticate, productController.getAllProducts);
router.get("/id/:id",authenticate, productController.findProductById)

router.post("/", authenticate, productController.createProduct);

router.delete("/admin/products/:id", authenticate, productController.deleteProduct);

module.exports=router;