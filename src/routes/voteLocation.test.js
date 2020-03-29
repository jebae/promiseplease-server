import request from "supertest";
import app from "../server";

describe("routes.constituency", () => {
	describe("/vote-location", () => {
		test("?city=exist&constituency=exist", async () => {
			try {
				const res = await request(app)
					.get("/vote-location")
					.query({ city: "서울", constituency: "마포구을" });
	
				expect(res.statusCode).toEqual(200);
				expect("locations" in res.body).toEqual(true);
			} catch (err) {
				throw err;
			}
		});

		test("?city=not_exist&constituency=not_exist", async () => {
			try {
				const res = await request(app)
					.get("/vote-location")
					.query({ city: "서울", constituency: "not exist" });
	
				expect(res.statusCode).toEqual(400);
			} catch (err) {
				throw err;
			}
		});

		test("?city=exist", async () => {
			try {
				const res = await request(app)
					.get("/vote-location")
					.query({ city: "서울" });
	
				expect(res.statusCode).toEqual(400);
			} catch (err) {
				throw err;
			}
		});

		test("?constituency=exist", async () => {
			try {
				const res = await request(app)
					.get("/vote-location")
					.query({ constituency: "" });
	
				expect(res.statusCode).toEqual(400);
			} catch (err) {
				throw err;
			}
		});

		test("no query", async () => {
			try {
				const res = await request(app)
					.get("/vote-location");
	
				expect(res.statusCode).toEqual(400);
			} catch (err) {
				throw err;
			}
		});
	});
});