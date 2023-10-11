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

  const convertChunk = (chunk) =>
    Buffer.isBuffer(chunk) ? chunk.toString() : chunk

  return new Transform({
    objectMode: true,
    transform(chunk, encoding, callback) {
      data += convertChunk(chunk);

      callback();
    },
    flush(callback) {
      try {
        const json = JSON.parse(data);

        if (Array.isArray(json)) {
          json.forEach(this.push.bind(this));
        }
        else {
          this.push(json);
        }

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
