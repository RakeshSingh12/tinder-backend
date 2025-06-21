const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient.js");

// snippet-start:[ses.JavaScript.email.sendEmailV3]
// Import required AWS SDK clients and commands for Node.js
const createSendEmailCommand = (toAddress, fromAddress, subject, body) => {
  return new SendEmailCommand({
    Destination: {
      CcAddresses: [],
      ToAddresses: [toAddress],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `<h1>${body}</h1>`,
        },
        Text: {
          Charset: "UTF-8",
          Data: "This is the text format email",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [
      /* more items */
    ],
  });
};

// This function sends an email using the AWS SES service.
/**
 * Sends an email using AWS SES.
 *
 * @param {string} subject - The subject of the email.
 * @param {string} body - The body of the email.
 * @param {string} toEmailId - The recipient's email address.
 * @returns {Promise} - A promise that resolves when the email is sent.
 */
const run = async (subject, body, toEmailId) => {
  const sendEmailCommand = createSendEmailCommand(
    "akshaysaini.in@gmail.com", // Replace with the recipient's email address
    "akshay@devtinder.in",
    subject,
    body
  );

  try {
    // Send the email.
    // The promise will be rejected if the notification cannot be sent.
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};

// snippet-end:[ses.JavaScript.email.sendEmailV3]
module.exports = { run };
