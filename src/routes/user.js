const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const USER_SAFE_DATA = "firstName lastName age photoURL gender about skills";

//get all the pending connections request for the logged in user
userRouter.get("/user/request/received", userAuth, async (req, res) => {
  //TODO: Implement this logic
  try {
    // Retrieve all the pending connections requests for the logged in user
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);
    //}).populate("fromUserId", ["firstName", "lastName"]);

    if (!connectionRequest) {
      return res.status(404).json({ message: "No pending connections found" });
    }
    if (connectionRequest == 0) {
      return res.send({ message: "Connection is empty" });
    }
    res.json({
      message: "Data fetched successfully",
      data: connectionRequest,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const userData = connectionRequest.map((row) => {
      if (row.fromUserId._id.equals(loggedInUser._id)) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    if (!userData) {
      return res.status(404).json({ message: "No connections found" });
    }
    if (userData == 0) {
      return res.send({ message: "Connection is empty" });
    }
    res.json({
      message: "Data fetched successfully",
      data: userData,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});
module.exports = userRouter;
