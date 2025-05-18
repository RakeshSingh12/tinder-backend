const express = require("express");
const { userAuth } = require("../middlewares/auth"); // only authenticated user can access this route
const paymentRouter = express.Router();
const razorpayInstance = require("../utils/razorpay");
const PaymentModel = require("../models/payment");

paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    // Create a new order
    // The order is created with the amount, currency, and receipt
    // The amount is in the smallest currency unit (e.g., paise for INR)
    const order = await razorpayInstance.orders.create({
      amount: 50000, // amount in the smallest currency unit
      currency: "INR",
      receipt: "receipt#1",
      notes: {
        firstName: "value3",
        lastName: "value2",
        membershipType: "silver",
      },
    });
    console.log("Order created:", order);

    // Save the order details to the database
    const payment = new PaymentModel({
      userId: req.user._id, // Get the user ID from the authenticated user
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      status: order.status,
      notes: {
        firstName: order.notes.firstName,
        lastName: order.notes.lastName,
        membershipType: order.notes.membershipType,
      },
    });
    
    // Save the payment details to the database
    const savePayment = await payment.save();
    console.log("Payment saved:", savePayment);
    
    // The order details are returned to the frontend
    res.json({ ...savePayment.toJSON()  });

  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = paymentRouter;
