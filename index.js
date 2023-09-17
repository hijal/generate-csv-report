// Import the 'dotenv' library to load environment variables from a .env file
require('dotenv').config();
const fs = require('fs');
const { assert } = require('console');

// Import necessary dependencies and modules
const config = require('./config'); // Configuration settings
const getUser = require('./axios'); // Function to fetch user data
const Csv = require('./Csv'); // CSV handling class
const mailer = require('./mailer'); // Email sending module
const csv = new Csv(); // Create an instance of the Csv class

// Immediately Invoked Function Expression (IIFE) to execute code
(async () => {
  // Fetch user data using the Axios module
  const users = await getUser();

  // Define an asynchronous generator function for generating CSV lines
  const csv_lns_gn = async function* (users) {
    let ln_cnt = 0;

    for (let user of users) {
      // Yield an array representing a CSV line for each user
      yield [
        ++ln_cnt, // Serial number
        user.name, // User name
        user.username, // User username
        user.email, // User email
        user.phone, // User phone
        user.website // User website
      ];
    }
  };

  await csv.writeFile('output.csv', csv_lns_gn(users), {
    header: true, // Include header in the CSV
    columns: ['serial_no', 'name', 'username', 'email', 'phone', 'website'] // Define CSV columns
  });

  // Define an asynchronous function for generating the CSV
  const csv_fn = async (users) => {
    return csv.writeStream(csv_lns_gn(users), {
      header: true, // Include header in the CSV
      columns: ['serial_no', 'name', 'username', 'email', 'phone', 'website'] // Define CSV columns
    });
  };

  // Send an email with the CSV attachment
  await mailer.send({
    from: config.email.sender, // Sender's email address
    to: config.email.recipient, // Recipient's email address
    subject: 'R&D: generate user CSV report', // Email subject
    text: 'PURPOSE: test for user report', // Email text content
    attachments: [
      {
        contentType: 'text/csv', // Content type of the attachment
        content: await csv_fn(users), // CSV content
        filename: 'user_list.csv' // Filename for the attachment
      }
    ]
  });
})();
