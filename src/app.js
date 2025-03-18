const express = require("express");
const connectDB = require("./config/database");
const cookiesParser = require("cookie-parser");

const app = express();
app.use(express.json());
const port = 7777;

app.use(cookiesParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

/* Start the server */
connectDB()
  .then(() => {
    console.log("MongoDB database connection established...");
  })
  .catch((err) => {
    console.error("Database connection error", err);
  });

/*  listen port number */
app.listen(port, () => {
  console.log("listening the server");
});
