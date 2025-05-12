const corn = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const sendEmail = require("./sendEmail"); // import the send email function
const connectionRequestModel = require("../models/connectionRequest"); 

corn.schedule("16 15 * * *", async () => {
  //send email to all pepole who got the request prvious day
  try {
    const yesterday = subDays(new Date(), 1); // get yesterday date
    const yesterdayStart = startOfDay(yesterday); // start of yesterday
    const yesterdayEnd = endOfDay(yesterday); // end of yesterday

    const pendingRequests = await connectionRequestModel
      .find({
        //// get all the requests that are interested and created yesterday
        status: "interested",
        createdAt: {
          $gte: yesterdayStart,
          $lte: yesterdayEnd,
        },
      })
      .populate("fromUserId toUserId"); // populate the fromUserId and toUserId with the user data

    const listEmail = [
      ...new Set(pendingRequests.map((req) => req.toUserId.emailId)),
    ]; // get the unique email addresses of the users who got the request

    for (const email of listEmail) {
        // send email to each user
       try {
        const res = await sendEmail.run(
          "New Friend Requests pending for " + email,
          "Ther eare so many frined reuests pending, please login to DevTinder.in and accept or reject the reqyests."
        );
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    }
  } catch (err) {
    console.error(err);
  }
});