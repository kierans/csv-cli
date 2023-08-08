const { assertThat, equalTo, is } = require("hamjest");

const { jsonWriter } = require("../src/json");

describe("json", function() {
	describe("jsonWriter", function() {
		async function collect(readable) {
			let data = "";
			
			for await (const chunk of readable) {
				data += chunk;
			}

			return data;
		}

		function name(name) {
			const segments = name.split(" ");

			return {
				first: segments[0],
				last: segments[1]
			};
		}

		it("should output valid JSON", async function() {
			const writer = jsonWriter();
			const eventualResult = collect(writer);
			const names = [
				name("Bruce Wayne"),
				name("Peter Parker"),
				name("Alfred Pennyworth")
			];

			names.forEach((name) => writer.write(name));
			writer.end();
			
			const result = JSON.parse(await eventualResult);

			assertThat(result, is(equalTo(names)));
		});
	})
})