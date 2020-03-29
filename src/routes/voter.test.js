import request from "supertest";
import app from "../server";

describe("routes.voter", () => {
	test("/voter/count", async () => {
		try {
			const res = await request(app)
				.get("/voter/count");

			expect(res.statusCode).toEqual(200);
			expect("count" in res.body).toEqual(true);
		} catch (err) {
			throw err;
		}
	});
});