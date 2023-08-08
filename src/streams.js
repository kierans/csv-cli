const fs = require("fs");
const path = require("path");

// pathResolve :: String -> String
const pathResolve = (filename) =>
	path.resolve(process.cwd(), filename)

// createInputStream :: Readable, String? -> Readable
const createInputStream = (fallback, filename) => {
	const stream = filename
		? fs.createReadStream(pathResolve(filename))
		: fallback;

	stream.setEncoding("utf8");

	return stream;
}

// createOutputStream :: Writable, String? -> Writable
const createOutputStream = (fallback, filename) =>
	filename
		? fs.createWriteStream(pathResolve(filename), { encoding: "utf8" })
		: fallback

module.exports = {
	createInputStream,
	createOutputStream
}