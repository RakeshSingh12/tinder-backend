const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const sendEmail = require("./sendEmail");
const connectionRequestModel = require("../models/connectionRequest");
const config = require("../config/config");

// Email template for pending requests
const getEmailTemplate = (email) => ({
  subject: `New Friend Requests Pending for ${email}`,
  body: `There are friend requests pending for your review. Please login to DevTinder.in and accept or reject the requests.`
});

// Process email sending with retry logic
const sendEmailWithRetry = async (email, template, maxRetries = 3) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await sendEmail.run(template.subject, template.body);
      console.log(`Email sent successfully to ${email} on attempt ${attempt}`);
      return result;
    } catch (error) {
      console.error(`Email attempt ${attempt} failed for ${email}:`, error.message);
      
      if (attempt === maxRetries) {
        throw new Error(`Failed to send email to ${email} after ${maxRetries} attempts`);
      }
      
      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
};

// Main cron job function
const processPendingRequests = async () => {
  const startTime = Date.now();
  console.log(`Starting pending requests processing at ${new Date().toISOString()}`);
  
  try {
    const yesterday = subDays(new Date(), 1);
    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);

    // Find pending requests with pagination for better performance
    const batchSize = 100;
    let processedCount = 0;
    let emailCount = 0;

    // Process in batches to avoid memory issues
    let skip = 0;
    let hasMore = true;

    while (hasMore) {
      const pendingRequests = await connectionRequestModel
        .find({
          status: "interested",
          createdAt: {
            $gte: yesterdayStart,
            $lte: yesterdayEnd,
          },
        })
        .populate("fromUserId toUserId", "email firstName lastName")
        .limit(batchSize)
        .skip(skip)
        .lean(); // Use lean() for better performance

      if (pendingRequests.length === 0) {
        hasMore = false;
        break;
      }

      // Group requests by recipient email
      const emailGroups = pendingRequests.reduce((groups, request) => {
        const email = request.toUserId?.email;
        if (email) {
          if (!groups[email]) {
            groups[email] = [];
          }
          groups[email].push(request);
        }
        return groups;
      }, {});

      // Send emails to each unique recipient
      const emailPromises = Object.entries(emailGroups).map(async ([email, requests]) => {
        try {
          const template = getEmailTemplate(email);
          await sendEmailWithRetry(email, template);
          emailCount++;
          return { email, success: true };
        } catch (error) {
          console.error(`Failed to send email to ${email}:`, error.message);
          return { email, success: false, error: error.message };
        }
      });

      // Wait for all emails in this batch to complete
      const results = await Promise.allSettled(emailPromises);
      
      // Log results
      results.forEach(result => {
        if (result.status === 'fulfilled') {
          if (result.value.success) {
            console.log(`Email sent successfully to ${result.value.email}`);
          } else {
            console.error(`Email failed for ${result.value.email}: ${result.value.error}`);
          }
        } else {
          console.error('Email promise rejected:', result.reason);
        }
      });

      processedCount += pendingRequests.length;
      skip += batchSize;

      // Add small delay between batches to prevent overwhelming the system
      if (hasMore) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    const duration = Date.now() - startTime;
    console.log(`Pending requests processing completed in ${duration}ms`);
    console.log(`Processed ${processedCount} requests, sent ${emailCount} emails`);

  } catch (error) {
    console.error('Error in pending requests processing:', error);
    
    // Send alert email to admin if configured
    if (config.adminEmail) {
      try {
        await sendEmail.run(
          'Cron Job Error Alert',
          `The pending requests cron job failed with error: ${error.message}\n\nStack trace: ${error.stack}`
        );
      } catch (emailError) {
        console.error('Failed to send admin alert email:', emailError);
      }
    }
  }
};

// Schedule the cron job to run every day at 3:16 PM
const schedulePendingRequestsJob = () => {
  if (config.nodeEnv === 'test') {
    console.log('Skipping cron job in test environment');
    return;
  }

  cron.schedule("16 15 * * *", processPendingRequests, {
    scheduled: true,
    timezone: "UTC"
  });

  console.log('Pending requests cron job scheduled for daily execution at 3:16 PM UTC');
};

// Export for testing and manual execution
module.exports = {
  processPendingRequests,
  schedulePendingRequestsJob,
  sendEmailWithRetry
};

// Start the cron job if this file is run directly
if (require.main === module) {
  schedulePendingRequestsJob();
}