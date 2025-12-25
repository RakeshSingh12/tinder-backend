const Razorpay = require("razorpay");

// create an instance of Razorpay
// This is used to create an instance of Razorpay with the key_id and key_secret
// that you get from the Razorpay dashboard. This instance is used to make API calls to Razorpay.
var instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

module.exports = instance;
