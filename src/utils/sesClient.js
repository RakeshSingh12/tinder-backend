const { SESClient } = require("@aws-sdk/client-ses");
// Set the AWS Region.
const REGION = process.env.AWS_REGION; //e.g. "us-east-1"
// Create SES service object.
const sesClient = new SESClient({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY, // AWS Access Key
    secretAccessKey: process.env.AWS_SECRET_KEY, // AWS Secret Key
  },
});

module.exports = { sesClient };
// snippet-end:[ses.JavaScript.createclientv3]
