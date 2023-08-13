
const { Command } = require("commander");

const { csvParser, csvWriter } = require("../csv")
const { createInputStream, createOutputStream } = require("../streams");
const { jsonParser, jsonWriter } = require("../json");
const { pipeline } = require("../pipeline");

// createPipeline :: String -> [Duplex]
const createPipeline = (type) => {
	switch (type) {
		case 'json':
			return [
				csvParser(),
				jsonWriter()
			];

		case 'csv':
			return [
				jsonParser(),
				csvWriter()
			]

		default:
			throw new Error(`Unrecognised type ${type}`);
	}
}

const handler = async (opts) => {
	const type = opts.type;
	const input = createInputStream(process.stdin, opts.input);
	const output = createOutputStream(process.stdout, opts.output)

	await pipeline(...createPipeline(type))(
		input,
		output
	);
}

const helpText =
`
If the output type is CSV, it is assumed the input is JSON.
If the output type is anything else, it is assumed the input is CSV.
`
const command = new Command()
	.name("convert")
	.description("Convert files to and from CSV")
	.requiredOption("-t, --type <type>", "The type of data to output eg: json, csv")
	.option("-i, --input [file]", "Input file. If not specified defaults to STDIN")
	.option("-o, --output [file]", "Output file. If not specified defaults to STDOUT")
	.addHelpText("after", helpText)
	.action(handler);

module.exports = command;
