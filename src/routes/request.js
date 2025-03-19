const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId", // TODO: status should be dynamic and toUserId should be dynamic (: means dynamic)
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const isAllowed = ["ignored", "interested"];
      if (!isAllowed.includes(status)) {
        return res.status(400).json("Invalid status type " + status);
      }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({ message: "User not found!!!!!" });
      }

      //if there is an existing connection request
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest) {
        return res
          .status(400)
          .json({ massage: "Connection request already sent" });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const ConnectionData = await connectionRequest.save();
      res.json({
        message: req.user.firstName + " is " +status + " in " + toUser.firstName,
        ConnectionData: ConnectionData,
      });
    } catch (err) {
      res.status(400).send("Error: " + err.message);
    }
  }
);

module.exports = requestRouter;
