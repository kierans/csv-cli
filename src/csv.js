const { parse, stringify } = require("csv");

// csvParser :: () -> Duplex
const csvParser = () => parse({
	columns: true
})

// csvWriter :: () -> Duplex
const csvWriter = () => stringify({
	header: true
})

module.exports = {
	csvParser,
	csvWriter
}
