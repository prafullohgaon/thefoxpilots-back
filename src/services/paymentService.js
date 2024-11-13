const razorpay = require("../config/razorpayClient.js")
const orderService = require("../services/orderService.js")


const createPaymentLink = async( orderId)=>{
    try {
        const order=await orderService.findOrderById(orderId)
        const paymentLinkRequest={
            amount:order.totalPrice*100,
            currency: "INR",
            customer:{
                name: order.user.firstName+" "+order.user.lastName,
                contact:order.user.mobile,
                email:order.user.email
            },
            notify:{
                sms:true,
                email:true,
            },
            reminder_enable: true,
            callback_url:`http://localhost:3000/payment/${orderId}`,
            callback_method: 'get'
        };

        const paymentLink = await razorpay.paymentLink.create(paymentLinkRequest);
        const paymentLinkId = paymentLink.id;
        const payment_link_url = paymentLink.short_url;

        const resData={
            paymentLinkId,
            payment_link_url
        }

        return resData;
    } catch (error) {
        throw new Error(error.message);
        
    }
}


// const updatePaymentInformation = async(reqData)=>{
//     const paymentId = reqData.payment_id;
//     const orderId=reqData.order_id;

//     try {
//         const order=await orderService.findOrderById(orderId);

//         const payment = await razorpay.payment.fetch(paymentId)
//         if(payment.status=="captured"){
//             order.paymentDetails.paymentId=paymentId;
//             order.paymentDetails.status="COMPLETED";
//             order.orderStatus="PLACED";

//             await order.save()
//         }

//         const resData={message: "your order is placed", success:true}

//         return resData;

        
//     } catch (error) {
//         throw new Error(error.message);
        
//     }
// }


const updatePaymentInformation = async (reqData) => {
    const paymentId = reqData.payment_id;
    const orderId = reqData.order_id;

    try {
        const order = await orderService.findOrderById(orderId);
        if (!order) throw new Error("Order not found");

        const payment = await razorpay.payment.fetch(paymentId);
        if (payment.status === "captured") {
            order.paymentDetails.paymentId = paymentId;
            order.paymentDetails.status = "COMPLETED";
            order.orderStatus = "PLACED";
            await order.save();
        } else {
            console.log("Payment not captured:", payment.status);
        }

        return { message: "Your order is placed", success: true };

    } catch (error) {
        console.error("Error updating payment information:", error);
        throw new Error("Failed to update payment information");
    }
};



module.exports={
    createPaymentLink,
    updatePaymentInformation
}