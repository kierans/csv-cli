#!/usr/bin/env node

const { Command } = require("commander");

const program = new Command()
	.name("csv-cli")
	.version("0.1.0")
	.description("A CLI wrapper around the node csv package");

program.addCommand(require("./commands/convert"));

const main = async() => {
	await program.parseAsync(process.argv);
}

main();