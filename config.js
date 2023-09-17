// Get the SendGrid API key from the environment variables
const apiKey = process.env.SENDGRID_API_KEY;

// Get the sender's email address from the environment variables
const sender = process.env.SENDER_MAIL;

// Get the recipient's email address from the environment variables
const recipient = process.env.RECIPIENT_MAIL;

// Export an object containing SendGrid API key and email addresses
module.exports = {
  sendgrid: {
    api_key: apiKey // Store the SendGrid API key
  },
  email: {
    sender: sender, // Store the sender's email address
    recipient: recipient // Store the recipient's email address
  }
};
