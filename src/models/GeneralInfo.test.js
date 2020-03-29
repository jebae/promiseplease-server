import models from ".";

const { GeneralInfo } = models;

describe("models.GeneralInfo", () => {
	test("voterCount", async () => {
		try {
			const count = await GeneralInfo.voterCount();

			expect(typeof count).toEqual("number");
		} catch (err) {
			throw err;
		}
	});
});