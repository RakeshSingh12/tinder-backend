const express = require("express");
const connectDB = require("./config/database");
const cookiesParser = require("cookie-parser");
const app = express();
const cors = require("cors");

require('dotenv').config()

require("./utils/cornJob");

app.use(
  cors({
    origin: "http://localhost:5173", // replace with your front-end URL
    credentials: true,
  })
);
app.use(express.json());

app.use(cookiesParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const paymentRouter = require("./routes/payment");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);

/* Start the server */
connectDB()
  .then(() => {
    console.log("MongoDB database connection established...");
  })
  .catch((err) => {
    console.error("Database connection error", err);
  });

/*  listen port number */
app.listen(process.env.PORT, () => {
  console.log("listening the server");
});
