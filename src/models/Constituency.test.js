import models from ".";

const Constituency = models.Constituency;

describe("models.Constituency", () => {
	describe("findByNameCity", () => {
		test("exist", async () => {
			try {
				const name = "청주시갑";
				const city = "충북";
				const constituency = await Constituency.findByNameCity({ name, city });
				const attrs = [ "id", "name", "code" ];

				attrs.forEach(item => {
					expect(item in constituency).toEqual(true);
				});
				expect(typeof constituency.id).toEqual("number");
				expect(typeof constituency.name).toEqual("string");
				if (constituency.code !== null) {
					expect(typeof constituency.code).toEqual("string");
				}
			} catch (err) {
				throw err;
			}
		});
		
		test("not exist", async () => {
			try {
				const name = "notexist";
				const city = "notexist";
				const constituency = await Constituency.findByNameCity({ name, city });

				expect(constituency).toEqual(null);
			} catch (err) {
				throw err;
			}
		});
	});
});