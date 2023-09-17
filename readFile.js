const fs = require('fs');
const Csv = require('./Csv'); // Replace with the correct path to your Csv module
const { assert } = require('console');

const jsonData = {
  id: 1,
  name: 'Leanne Graham',
  username: 'Bret',
  email: 'Sincere@april.biz',
  address: {
    street: 'Kulas Light',
    suite: 'Apt. 556',
    city: 'Gwenborough',
    zipcode: '92998-3874',
    geo: {
      lat: '-37.3159',
      lng: '81.1496'
    }
  },
  phone: '1-770-736-8031 x56442',
  website: 'hildegard.org',
  company: {
    name: 'Romaguera-Crona',
    catchPhrase: 'Multi-layered client-server neural-net',
    bs: 'harness real-time e-markets'
  }
};

// Convert JSON data to CSV format
const csvData = `${Object.keys(jsonData).join(',')}\n${Object.values(
  jsonData
).join(',')}`;

// Create a temporary CSV file for testing
const tempCsvFilePath = './temp.csv';
fs.writeFileSync(tempCsvFilePath, csvData);

// Create an instance of the Csv class
const csv = new Csv();

// Define a callback function to process each CSV record
const processRecord = (record) => {
  // Perform assertions or validations on the record
  // For example, you can assert that the record has certain properties or values
  assert(record.hasOwnProperty('id'));
  assert(record.hasOwnProperty('name'));
  assert(record.hasOwnProperty('email'));
  // Add more assertions as needed
};

(async () => {
  try {
    // Call the readFile method to read and process the temporary CSV file
    await csv.readFile(tempCsvFilePath, processRecord);

    // If the function completes without errors, the test passes
  } catch (error) {
    // Handle any errors that may occur during the test
    console.log(error);
  }
})();
