const { Transform } = require("stream");

// jsonWriter :: () -> Duplex
const jsonWriter = () => {
  let count = 0;

  /*
   * For performance we don't buffer the records.
   */
  return new Transform({
    objectMode: true,
    construct(callback) {
      this.push("[");

      callback();
    },
    transform(record, encoding, callback) {
      if (count > 0) {
        this.push(",");
      }

      this.push(JSON.stringify(record));

      count++;
      callback();
    },
    flush(callback) {
      this.push("]");

      callback();
    }
  })
}

// jsonParser :: () -> Duplex
const jsonParser = () => {
  let data = "";

  return new Transform({
    objectMode: true,
    transform(chunk, encoding, callback) {
      if (Buffer.isBuffer(chunk)) {
        data += chunk.toString();
      }
      else {
        data += chunk;
      }

      callback();
    },
    flush(callback) {
      try {
        this.push(JSON.parse(data));

        callback();
      }
      catch (e) {
        callback(e);
      }
    }
  });
}

module.exports = {
  jsonParser,
  jsonWriter
}
