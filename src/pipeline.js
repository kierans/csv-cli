const { pipeline } = require("stream/promises");

// pipe :: [Duplex] -> (Readable, Writable) => Promise<Unit>
const pipe = (...streams) => (input, output) =>
	pipeline(
		input,
		...streams,
		output
	)

module.exports = {
	pipeline: pipe
}