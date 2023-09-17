// Import the necessary npm dependencies
const fs = require('fs'); // File system module
const handlebars = require('handlebars'); // Handlebars templating engine

// Initialize an object to store compiled templates
const templates = {};

// Function for rendering a template with the given data
async function render(template_path, data) {
  let template = templates[template_path];

  // Check if the template is already compiled and cached
  if (!template) {
    template = await new Promise((resolve, reject) => {
      // Read the template file asynchronously
      fs.readFile(template_path, 'utf-8', (err, template_data) => {
        if (err) {
          return reject(err);
        }
        // Compile the template using Handlebars
        return resolve(handlebars.compile(template_data));
      });
    });

    // Cache the compiled template for future use
    templates[template_path] = template;
  }

  // Render the template with the provided data and return the result
  return template(data);
}

// Function for registering custom Handlebars helpers
function register(helper_name, fn) {
  handlebars.registerHelper(helper_name, fn);
}

// Export the render and register functions for use in other modules
module.exports = {
  render,
  register
};
