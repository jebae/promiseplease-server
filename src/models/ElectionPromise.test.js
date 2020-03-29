import models from ".";

const { ElectionPromise } = models;

describe("models.ElectionPromise", () => {
	test("countByCategory", async () => {
		try {
			const counts = await ElectionPromise.countByCategory();
			const attrs = [ "cat", "count" ];

			expect(counts).not.toHaveLength(0);
			counts.forEach(count => {
				attrs.forEach(attr => {
					expect(attr in count).toEqual(true);
				});
				expect(typeof count.cat).toEqual("string");
				expect(typeof count.count).toEqual("number");
			});
		} catch (err) {
			throw err;
		}
	});

	test("countByCityCategory", async () => {
		try {
			const counts = await ElectionPromise.countByCityCategory();
			const attrs = [ "city", "cats", "total" ];

			expect(counts).not.toHaveLength(0);
			counts.forEach(count => {
				attrs.forEach(attr => {
					expect(attr in count).toEqual(true);
				});
				expect(typeof count.city).toEqual("string");
				expect(typeof count.total).toEqual("number");
				expect(typeof count.cats).toEqual("object");
				count.cats.forEach(cat => {
					expect(typeof cat.cat).toEqual("string");
					expect(typeof cat.count).toEqual("number");
				});
			});
		} catch (err) {
			throw err;
		}
	})
});