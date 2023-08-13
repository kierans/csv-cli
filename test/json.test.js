const { assertThat, equalTo, is, promiseThat, isRejectedWith, instanceOf } = require("hamjest");

const { jsonParser, jsonWriter } = require("../src/json");

describe("json", function() {
	const names = [
		givenName("Bruce Wayne"),
		givenName("Peter Parker"),
		givenName("Alfred Pennyworth")
	];

	const collect = (readable) => {
		let data;

		return new Promise((resolve, reject) => {
			readable.on("data", (chunk) => {
				if (data) {
					data = data.concat(chunk);
				}
				else {
					if (typeof chunk === "string") {
						data = chunk;
					}
					else {
						data = [ chunk ];
					}
				}
			});

			readable.on("end", () => resolve(data));

			readable.on("error", reject);
		});
	};

	describe("jsonParser", function() {
		let parser;

		beforeEach(function() {
			parser = jsonParser();
		});

		it("should parse JSON", async function() {
			const eventualResult = collect(parser);
			parser.end(JSON.stringify(names));

			const result = await eventualResult;

			assertThat(result, is(equalTo(names)));
		});

		it("should buffer input until end", async function() {
			const eventualResult = collect(parser);
			parser.write("{");
			parser.write(`"key": `);
			parser.write(`"value"`);
			parser.end("}");

			await eventualResult;
		});

		it("should convert non string to UTF8 string", async function() {
			const eventualResult = collect(parser);
			parser.end(Buffer.from(JSON.stringify(names)));

			const result = await eventualResult;

			assertThat(result, is(equalTo(names)));
		});

		it("should return error for invalid JSON", async function() {
			const eventualResult = collect(parser);
			parser.end("{");

			await promiseThat(eventualResult, isRejectedWith(instanceOf(Error)));
		});
	});

	describe("jsonWriter", function() {
		it("should output valid JSON", async function() {
			const writer = jsonWriter();
			const eventualResult = collect(writer);

			names.forEach((name) => writer.write(name));
			writer.end();

			const result = JSON.parse(await eventualResult);

			assertThat(result, is(equalTo(names)));
		});
	});

	function givenName(name) {
		const segments = name.split(" ");

		return {
			first: segments[0],
			last: segments[1]
		};
	}
})
