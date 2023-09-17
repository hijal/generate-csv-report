const Csv = require('./Csv'); // Assuming this module is in a file named Csv.js

const csv = new Csv();

// Define the JSON data you want to write to the CSV file
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

// Create an asynchronous iterator that yields the data as an array of objects
async function* dataIterator() {
  yield jsonData;
}

// Example of writing the JSON data to a CSV file
csv
  .writeFile('output.csv', dataIterator(), {
    header: true, // Include header in the CSV
    columns: ['serial_no', 'name', 'username', 'email', 'phone', 'website'] // Define CSV columns
  })
  .catch((error) => {
    console.error(error);
  });
