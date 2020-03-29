import request from "supertest";
import app from "../server";

describe("routes.party", () => {
	describe("/party/count", () => {
		test("no query", async () => {
			try {
				const res = await request(app)
					.get("/party/count");
	
				expect(res.statusCode).toEqual(200);
				expect("count" in res.body).toEqual(true);
			} catch (err) {
				throw err;
			}
		});
	});
});