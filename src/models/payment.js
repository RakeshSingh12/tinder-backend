const mangoose = require('mongoose');

// This is the payment schema for the payment collection in MongoDB.
// It defines the structure of the payment documents that will be stored in the database.
const paymentSchema = new mangoose.Schema({
    userId: {
        type: mangoose.Types.ObjectId,
        ref: 'User', // reference to the user collection schema or Joining the two schemas(user and paymentSchema)
        required: true,
    },
    orderId: {
        type: String,
        required: true,
    },
    paymentId: {
        type: String,
    },
    amount: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        required: true,
    },
    receipt: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,},
    notes: {
        firstName: {
            type: String,
        },
        lastName: {
            type: String,
        },
        membershipType: {
            type: String,
        },
    },
}, { timestamps: true });

module.exports = mangoose.model('Payment', paymentSchema);