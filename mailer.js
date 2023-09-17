'use strict';

// Import necessary npm dependencies
const path = require('path'); // Path module for working with file paths
const nodemailer = require('nodemailer'); // Nodemailer for sending emails
const nodemailerSendgrid = require('nodemailer-sendgrid'); // Nodemailer SendGrid transport

// Import app dependencies
const template = require('./template'); // Template rendering module
const config = require('./config'); // Configuration settings

// Function to render a template file with provided data
const render = (template_file, data) => {
  // Resolve the full path to the template file
  const template_path = path.resolve(
    __dirname,
    '..',
    'assets',
    'templates',
    template_file
  );
  // Render the template and return the result
  return template.render(template_path, data);
};

// Create and configure the mailer
const mailer = () => {
  // Create a transport using Nodemailer SendGrid with the API key from the configuration
  const transport = nodemailer.createTransport(
    nodemailerSendgrid({
      apiKey: config.sendgrid.api_key
    })
  );

  // Function to send an email message
  const send = async (message) => {
    // If the message includes a template, render it
    if (message.template) {
      const { name, data } = message.template;
      const extension = path.extname(name);

      // Check the extension to determine the type (html or text)
      if (['.html', '.txt'].includes(extension)) {
        const type = extension === '.html' ? 'html' : 'text';
        message[type] = await render(name, data);
      } else {
        // Render both HTML and text versions of the template
        const [html, text] = await Promise.all([
          render(`${name}.html`, data),
          render(`${name}.txt`, data)
        ]);
        message.html = html;
        message.text = text;
      }
      // Remove the 'template' property from the message object
      delete message.template;
    }

    // Send the email using the configured transport
    return transport.sendMail(message);
  };

  // Return an object with the 'send' function
  return { send };
};

// Export the mailer instance
module.exports = mailer();
