import models from ".";

const { Party } = models;

describe("models.Party", () => {
	test("countAll", async () => {
		try {
			const count = await Party.countAll();

			expect(typeof count).toEqual("number");
			expect(count).not.toEqual(0);
			expect(count).not.toEqual(NaN);
		} catch (err) {
			throw err;
		}
	});
});