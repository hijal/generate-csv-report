const fs = require('fs');
// Import the 'stringify' function from the 'csv-stringify' library
const isFileStream = require('is-file-stream');
const { parse } = require('csv-parse');
const { stringify } = require('csv-stringify');

// Define a class called Csv for handling CSV operations
class Csv {
  constructor() {
    // Configuration options for CSV processing
    this.config = {
      bom: true, // Include a BOM character at the beginning of the CSV
      columns: true, // Include column headers in the CSV output
      delimiter: ',', // Delimiter used to separate values
      trim: true, // Trim leading/trailing spaces from values
      quote: '"', // Character used for quoting values
      escape: '\\', // Character used for escaping special characters
      skip_empty_lines: true // Skip empty lines in the CSV output
    };
  }

  // Asynchronously read data from a CSV file or stream
  async readFile(file_strm, read_fn, opts) {
    // Merge the default configuration with user-specified options
    const options = {
      ...this.config,
      ...opts
    };

    // Check if the 'file_strm' parameter is a string (path to a file)
    if (typeof file_strm === 'string') {
      // Check if the file exists and is readable
      let file_xsts = await new Promise((rslv) => {
        fs.access(file_strm, fs.constants.F_OK | fs.constants.R_OK, (error) => {
          if (error) {
            return rslv(false);
          }
          return rslv(true);
        });
      });

      if (file_xsts) {
        // If the file exists, create a read stream from it
        file_strm = fs.createReadStream(file_strm);
      } else {
        // If the file does not exist, throw an error
        throw new Error('File not found');
      }
    }

    // Check if 'file_strm' is a valid stream
    if (!isFileStream(file_strm)) {
      throw new Error('File is not a valid stream');
    }

    // Create a CSV parsing iterator from the file stream
    const records_iterator = file_strm.pipe(parse(options));

    // Iterate through the CSV records and apply the 'read_fn' to each record
    for await (let record of records_iterator) {
      await Promise.resolve(read_fn(record));
    }
  }

  // Asynchronously write data to a CSV stream
  async writeStream(writes_itrtr, opts) {
    // Merge the default configuration with user-specified options
    const options = {
      ...this.config,
      ...opts
    };

    // Create a writable CSV stream with the specified options
    const write_strm = stringify(options);

    // Handle errors that may occur during CSV writing
    write_strm.on('error', (error) => {
      console.log(error);
    });

    // Iterate through the data to be written and write it to the stream
    for await (let write of writes_itrtr) {
      write_strm.write(write);
    }

    // End the stream to finalize the CSV
    write_strm.end();

    // Return the writable CSV stream
    return write_strm;
  }

  // Asynchronously write data to a CSV file
  async writeFile(file_path, writes_iterator, opts) {
    // Create a write stream to the specified file path
    const file_stream = fs.createWriteStream(file_path);

    // Write the data to the CSV file using 'writeStream'
    const data_stream = await this.writeStream(writes_iterator, opts);
    data_stream.pipe(file_stream);
  }
}

// Export the Csv class for use in other modules
module.exports = Csv;
