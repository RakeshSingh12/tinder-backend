const mongoose = require("mongoose");

// This function connects to the MongoDB database using Mongoose.
// It uses the connection string stored in the environment variable DB_CONNECTION_SECRET.
const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // reference to the user collection schema or Joining the two schemas(user and connectionRequestschema)
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // reference to the user collection schema or Joining the two schemas(user and connectionRequestschema)
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
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

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
