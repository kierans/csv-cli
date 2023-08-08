
const { Command } = require("commander");

const { createInputStream, createOutputStream } = require("../streams");
const { pipeline } = require("../pipeline");

const handler = async (opts) => {
	const input = createInputStream(process.stdin, opts.input);
	const output = createOutputStream(process.stdout, opts.output)

	await pipeline()(
		input,
		output
	)
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