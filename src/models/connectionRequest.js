const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  {
    timestamps: true,
  }
);

// compaund index
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 })

connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  //Check if the fromUserId is same as the toUserId
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("Can't send connection request to yourself");
  }
  next();
});

const ConnectionRequestModel = mongoose.model(
  "connectionRequestModel",
  connectionRequestSchema
);

module.exports = ConnectionRequestModel;
