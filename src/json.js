const { Transform } = require("stream");

// jsonWriter :: () => Duplex
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

module.exports = {
  jsonWriter
}