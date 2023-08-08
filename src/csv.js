const { parse, stringify } = require("csv");

// csvParser :: () => Duplex
const csvParser = () => parse({
	columns: true
})

module.exports = {
	csvParser
}