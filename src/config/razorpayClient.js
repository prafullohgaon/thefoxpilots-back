const Razorpay = require("razorpay");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

module.exports = razorpay;




// ------------------------------------------------------



// const Razorpay = require('razorpay');


// apiKey="rzp_test_waD2yv4dRVrPGb";
// apiSecret="lskqaz5tGDcXaqWROzxycV2E";

// const razorpay = new Razorpay({
//   key_id: apiKey,
//   key_secret: apiSecret,
// });

// module.exports=razorpay