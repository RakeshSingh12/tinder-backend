const express = require('express');
const { userAuth } = require("../middlewares/auth")

const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest",userAuth, async (req, res) => {
    try {
      const user = req.user;
      console.log("Sending a connection request");
      res.send(user.firstName+ "  sent a connection request")
    } catch (err) {
      res.status(400).send("Error: "+ err.message);
    }
  });

module.exports = requestRouter;