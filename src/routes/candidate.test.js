import request from "supertest";
import app from "../server";

describe("routes.candidate", () => {
	describe("/candidate", () => {
		test("constituency exist", async () => {
			try {
				const res = await request(app)
					.get("/candidate")
					.query({ city: "대전", constituency: "서구을" });
	
				expect(res.statusCode).toEqual(200);
				expect("candidates" in res.body).toEqual(true);
			} catch (err) {
				throw err;
			}
		});

		test("constituency not exist", async () => {
			try {
				const res = await request(app)
					.get("/candidate")
					.query({ city: "대전", constituency: "없는구" });
	
				expect(res.statusCode).toEqual(400);
			} catch (err) {
				throw err;
			}
		});

		test("no city", async () => {
			try {
				const res = await request(app)
					.get("/candidate")
					.query({ constituency: "마포구갑" });
	
				expect(res.statusCode).toEqual(400);
			} catch (err) {
				throw err;
			}
		});

		test("no constituency", async () => {
			try {
				const res = await request(app)
					.get("/candidate")
					.query({ city: "대전" });
	
				expect(res.statusCode).toEqual(400);
			} catch (err) {
				throw err;
			}
		});

		test("no query", async () => {
			try {
				const res = await request(app)
					.get("/candidate");
	
				expect(res.statusCode).toEqual(400);
			} catch (err) {
				throw err;
			}
		});
	});

	describe("/candidate/count", () => {
		test("no query", async () => {
			try {
				const res = await request(app)
					.get("/candidate/count");

				expect(res.statusCode).toEqual(200);
				expect("count" in res.body).toEqual(true);
			} catch (err) {
				throw err;
			}
		});

		test("?groupby=[city,gender]", async () => {
			try {
				const res = await request(app)
					.get("/candidate/count")
					.query({ groupby: JSON.stringify([ "city", "gender" ]) });

				expect(res.statusCode).toEqual(200);
				expect("count" in res.body).toEqual(true);
			} catch (err) {
				throw err;
			}
		});

		test("?groupby=[gender]", async () => {
			try {
				const res = await request(app)
					.get("/candidate/count")
					.query({ groupby: JSON.stringify([ "gender" ]) });

				expect(res.statusCode).toEqual(200);
				expect("count" in res.body).toEqual(true);
			} catch (err) {
				throw err;
			}
		});

		test("?groupby=[generation,job]", async () => {
			try {
				const res = await request(app)
					.get("/candidate/count")
					.query({ groupby: JSON.stringify([ "generation", "job" ]) });

				expect(res.statusCode).toEqual(200);
				expect("count" in res.body).toEqual(true);
			} catch (err) {
				throw err;
			}
		});

		test("?groupby=[invalid]", async () => {
			try {
				const res = await request(app)
					.get("/candidate/count")
					.query({ groupby: JSON.stringify([ "job" ]) });

				expect(res.statusCode).toEqual(400);
			} catch (err) {
				throw err;
			}
		});
	});

	describe("/candidate/age", () => {
		test("?aggregate=avg", async () => {
			try {
				const res = await request(app)
					.get("/candidate/age")
					.query({ aggregate: "avg" });

				expect(res.statusCode).toEqual(200);
				expect("age" in res.body).toEqual(true);
			} catch (err) {
				throw err;
			}
		});

		test("?aggregate=min", async () => {
			try {
				const res = await request(app)
					.get("/candidate/age")
					.query({ aggregate: "min" });

				expect(res.statusCode).toEqual(200);
				expect("age" in res.body).toEqual(true);
			} catch (err) {
				throw err;
			}
		});

		test("?aggregate=max", async () => {
			try {
				const res = await request(app)
					.get("/candidate/age")
					.query({ aggregate: "max" });

				expect(res.statusCode).toEqual(200);
				expect("age" in res.body).toEqual(true);
			} catch (err) {
				throw err;
			}
		});

		test("?aggregate=invalid", async () => {
			try {
				const res = await request(app)
					.get("/candidate/age")
					.query({ aggregate: "invalid" });

				expect(res.statusCode).toEqual(400);
			} catch (err) {
				throw err;
			}
		});

		test("no query", async () => {
			try {
				const res = await request(app)
					.get("/candidate/age");

				expect(res.statusCode).toEqual(400);
			} catch (err) {
				throw err;
			}
		});
	});
});