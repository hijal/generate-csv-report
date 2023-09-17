// Import the Axios library and assign the default export to the axios variable
const axios = require('axios').default;

// Define an asynchronous function called getUser
const getUser = async () => {
  // Make an HTTP GET request to 'https://jsonplaceholder.typicode.com/users' using Axios
  const user = await axios.get('https://jsonplaceholder.typicode.com/users');

  // Return the data retrieved from the API
  return user.data;
};

// Export the getUser function so it can be used in other modules
module.exports = getUser;
