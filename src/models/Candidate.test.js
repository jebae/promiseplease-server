import models from ".";

const { Candidate, District, Constituency } = models;

describe("models.Candidate", () => {
	describe("findByConstituency", () => {
		let candidates;

		beforeAll(async () => {
			try {
				const query = {
					name: "서구을",
					city: "대전",
				};
				const constituencyId = (await Constituency.findByNameCity({ ...query })).id;

				candidates = await Candidate.findByConstituency(constituencyId);
			} catch (err) {
				throw err;
			}
		});

		test("length", () => {
			expect(candidates).not.toHaveLength(0);
		});

		test("attrs", () => {
			const attrs = [
				"number",
				"color",
				"birth",
				"name",
				"gender",
				"party",
				"promises",
				"careers",
			];

			for (let candidate of candidates) {
				attrs.forEach(item => {
					expect(item in candidate).toEqual(true);
				});
				expect("id" in candidate).toEqual(false);
				expect(typeof candidate.number).toEqual("number");
				if (candidate.color !== null)
					expect(typeof candidate.color).toEqual("string");
				expect(typeof candidate.name).toEqual("string");
				expect(typeof candidate.gender).toEqual("string");
				if (candidate.party !== null)
					expect(typeof candidate.party).toEqual("string");
				expect(typeof candidate.promises).toEqual("object");
				expect(typeof candidate.careers).toEqual("object");
			}
		});
		
		test("sorted by number", () => {
			const numbers = candidates.map(item => item.number);

			for (let i=0; i < numbers.length - 1; i++) {
				expect(numbers[i]).toBeLessThan(numbers[i + 1]);
			}
		});

		test("birth format == 'YYYY-MM-DD'", () => {
			for (let candidate of candidates) {
				expect(/^\d{4}-\d{2}-\d{2}$/.exec(candidate.birth)).not.toEqual(null);
			}
		});

		test("typeof promises == [ { content: STRING, cat: [ STRING ] } ]", () => {
			for (let candidate of candidates) {
				expect(typeof candidate.promises).toEqual("object");
				for (let promise of candidate.promises) {
					expect("content" in promise).toEqual(true);
					expect("cat" in promise).toEqual(true);
					expect(typeof promise.content).toEqual("string");
					expect(typeof promise.cat).toEqual("object");
					expect(promise.cat.length).toBeGreaterThan(0);
				}
			}
		});

		test("not exist", async () => {
			try {
				const candidates = await Candidate.findByConstituency(0);

				expect(candidates).toHaveLength(0);
			} catch (err) {
				throw err;
			}
		});
	});

	test("countAll", async () => {
		try {
			const count = await Candidate.countAll();

			expect(typeof count).toEqual("number");
			expect(count).not.toEqual(0);
			expect(count).not.toEqual(NaN);
		} catch (err) {
			throw err;
		}
	});

	test("countByCityGender", async () => {
		try {
			const counts = await Candidate.countByCityGender();
			const attrs = [ "man", "woman", "city" ];

			expect(counts).not.toHaveLength(0);
			for (let count of counts) {
				attrs.forEach(item => {
					expect(item in count).toEqual(true);
				});
				expect(typeof count.man).toEqual("number");
				expect(typeof count.woman).toEqual("number");
			}
		} catch (err) {
			throw err;
		}	
	});

	test("countByGender", async () => {
		try {
			const counts = await Candidate.countByGender();
			const attrs = ["man", "woman"];

			attrs.forEach(item => {
				expect(item in counts).toEqual(true);
			});
			expect(typeof counts.man).toEqual("number");
			expect(typeof counts.woman).toEqual("number");
		} catch (err) {
			throw err;
		}
	});

	describe("aggregateAge", () => {
		test("valid", async () => {
			try {
				const avg = await Candidate.aggregateAge("avg");
				const min = await Candidate.aggregateAge("min");
				const max = await Candidate.aggregateAge("max");
				
				expect(typeof avg).toEqual("number");
				expect(typeof min).toEqual("number");
				expect(typeof max).toEqual("number");
				expect(max).toBeGreaterThan(avg);
				expect(avg).toBeGreaterThan(min);
			} catch (err) {
				throw err;
			}
		});

		test("not valid", async () => {
			try {
				const age = await Candidate.aggregateAge("none");

				expect(age).toEqual(null);
			} catch (err) {
				throw err;
			}
		});
	});

	test("countByGenerationJob", async () => {
		try {
			const counts = await Candidate.countByGenerationJob();
			const attrs = [ "generation", "jobs", "total" ];

			for (let count of counts) {
				attrs.forEach(attr => {
					expect(attr in count).toEqual(true);
				});
				expect(typeof count.generation).toEqual("number");
				expect(typeof count.jobs).toEqual("object");
				expect(typeof count.total).toEqual("number");
				count.jobs.forEach(job => {
					expect(typeof job.job).toEqual("string");
					expect(typeof job.count).toEqual("number");
				});
			}
		} catch (err) {
			throw err;
		}
	});
});