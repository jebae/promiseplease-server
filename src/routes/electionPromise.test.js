import request from "supertest";
import app from "../server";

describe("routes.electionPromise", () => {
	describe("/promise/count", () => {
		test("?groupby=[category]", async () => {
			try {
				const res = await request(app)
					.get("/promise/count")
					.query({ groupby: JSON.stringify([ "category" ]) });
	
				expect(res.statusCode).toEqual(200);
				expect("count" in res.body).toEqual(true);
			} catch (err) {
				throw err;
			}
		});

		test("?groupby=[city,category]", async () => {
			try {
				const res = await request(app)
					.get("/promise/count")
					.query({ groupby: JSON.stringify([ "city", "category" ]) });
	
				expect(res.statusCode).toEqual(200);
				expect("count" in res.body).toEqual(true);
			} catch (err) {
				throw err;
			}
		});

		test("?groupby=[invalid]", async () => {
			try {
				const res = await request(app)
					.get("/promise/count")
					.query({ groupby: JSON.stringify([ "city" ]) });
	
				expect(res.statusCode).toEqual(400);
			} catch (err) {
				throw err;
			}
		});

		test("no query", async () => {
			try {
				const res = await request(app)
					.get("/promise/count");
	
				expect(res.statusCode).toEqual(400);
			} catch (err) {
				throw err;
			}
		});
	});
});