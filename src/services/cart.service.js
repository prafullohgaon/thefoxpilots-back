const Cart = require("../models/cart.model.js");
const CartItem = require("../models/cartItem.model");
const Product = require("../models/product.model.js");

async function createCart(user){
    try {
        const cart=new Cart({user});
        const createdCart = await cart.save();
        return createdCart;
    } catch (error) {
        throw new Error(error.message);
        
    }
}

// async function findUserCart(userId) {
//     try {
//         let cart = await Cart.findOne({ user: userId }); // Fixed to use userId
//         if (!cart) {
//             cart = await createCart(userId); // Create cart if it doesn't exist
//         }
//         let cartItems = await CartItem.find({ cart: cart._id }).populate("product");
//         cart.cartItems = cartItems;

//         let totalPrice = 0;
//         let totalDiscountedPrice = 0;
//         let totalItem = 0;

//         for (let cartItem of cart.cartItems) {
//             totalPrice += cartItem.price;
//             totalDiscountedPrice += cartItem.discountedPrice;
//             totalItem += cartItem.quantity;
//         }

//         cart.totalPrice = totalPrice;
//         cart.totalItem = totalItem;
//         cart.discount = totalPrice - totalDiscountedPrice;

//         return cart;
//     } catch (error) {
//         throw new Error(error.message);
//     }
// }


// async function findUserCart(userId){
//     try {
//         let cart=await Cart.findOne({user:user});
//         let cartItems = await CartItem.find({cart:cart._id}).populate("product");
//         cart.cartItems = cartItems;
//         let totalPrice = 0;
//         let totalDiscountedPrice = 0;
//         let totalItem=0;

//         for(let cartItem of cart.cartItems){
//             totalPrice+=cartItem.price;
//             totalDiscountedPrice+=cartItem.discountedPrice;
//             totalItem+=cartItem.quantity;
//         }
//         cart.totalPrice=totalPrice;
//         cart.totalItem = totalItem;
//         cart.discount = totalPrice-totalDiscountedPrice
//         return cart;
//     } catch (error) {
//         throw new Error("error.message");
        
//     }
// }
// ----------------------------------------------
// async function findUserCart(userId) {
//     try {
//         let cart = await Cart.findOne({ user: userId }).populate("user");
//         if (!cart) {
//             cart = await createCart(userId); // Create cart if it doesn't exist
//         }
//         let cartItems = await CartItem.find({ cart: cart._id }).populate("product"); // Ensure product is populated
//         cart.cartItems = cartItems;

//         let totalPrice = 0;
//         let totalDiscountedPrice = 0;
//         let totalItem = 0;

//         for (let cartItem of cart.cartItems) {
//             totalPrice += cartItem.price;
//             if (cartItem.discountedPrice !== undefined && cartItem.discountedPrice !== null) {
//                 totalDiscountedPrice += cartItem.discountedPrice; // Only add if defined
//             }
//             totalItem += cartItem.quantity;
//         }

//         cart.totalPrice = totalPrice;
//         cart.totalItem = totalItem;
//         cart.discount = totalPrice - totalDiscountedPrice;

//         return cart;
//     } catch (error) {
//         throw new Error(error.message);
//     }
// }

// --------------------------------------------------

async function findUserCart(userId) {
    try {
        let cart = await Cart.findOne({ user: userId }).populate("user");
        
        // Create cart if it doesn't exist
        if (!cart) {
            cart = await createCart(userId);
        }

        // Populate cart items with product details
        let cartItems = await CartItem.find({ cart: cart._id }).populate("product");
        cart.cartItems = cartItems;

        let totalPrice = 0;
        let totalDiscountedPrice = 0;
        let totalItem = 0;

        // Calculate totalPrice, totalDiscountedPrice, and totalItem
        for (let cartItem of cart.cartItems) {
            const product = cartItem.product; // Ensure product is populated
            totalPrice += product.price * cartItem.quantity;

            // Calculate the effective discounted price
            const effectiveDiscountedPrice = product.discountedPrice || (product.price * (1 - (product.discountPersent || 0) / 100));
            totalDiscountedPrice += effectiveDiscountedPrice * cartItem.quantity;

            totalItem += cartItem.quantity;
        }

        // Update cart fields based on calculated values
        cart.totalPrice = totalPrice;
        cart.totalDiscountedPrice = totalDiscountedPrice;
        cart.totalItem = totalItem;
        cart.discount = totalPrice - totalDiscountedPrice;

        return cart;
    } catch (error) {
        throw new Error(error.message);
    }
}





async function addCartItem(userId, req) {
    try {
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = await createCart(userId);
        }

        const product = await Product.findById(req.productId);
        if (!product) throw new Error("Product not found");

        const isPresent = await CartItem.findOne({ cart: cart._id, product: product._id, userId });

        if (!isPresent) {
            const cartItem = new CartItem({
                product: product._id,
                cart: cart._id,
                quantity: 1,
                userId: userId, // Explicitly set userId here
                price: product.price,
                size: req.size,
                discountedPrice: product.discountedPrice,
            });
            
            const createCartItem = await cartItem.save();
            cart.cartItems.push(createCartItem._id); // Push cartItem ID, not object
            await cart.save();

            return "Item added to cart";
        } else {
            return "Item already in cart";
        }
    } catch (error) {
        throw new Error(error.message);
    }
}





// async function addCartItem(userId,req){
//     try {
//         const cart = await Cart.findOne({user:userId});
//         const product = await Product.findById(req.productId);

//         const isPresent = await CartItem.findOne({cart:cart._id, product:product._id, userId})

//         if(!isPresent){
//             const cartItem = new CartItem({
//                 product:product._id,
//                 cart:cart._id,
//                 quantity:1,
//                 userId,
//                 price:product.price,
//                 size:req.size,
//                 discountedPrice:product.discountedPrice,
//             })
//             const createCartItem = await cartItem.save();
//             cart.cartItems.push(createCartItem);
//             await cart.save();
//             return "Item added to cart"
//         }
//     } catch (error) {
//         throw new Error(error.message);
        
//     }
// }

module.exports = {createCart, findUserCart, addCartItem}