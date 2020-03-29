import request from "supertest";
import app from "../server";

describe("routes.word", () => {
	describe("/word", () => {
		test("?text=valid", async () => {
			try {
				const res = await request(app)
					.get("/word")
					.query({ text: "서" });

				expect(res.statusCode).toEqual(200);
				expect("words" in res.body).toEqual(true);
				expect("next" in res.body).toEqual(true);
			} catch (err) {
				throw err;
			}
		});

		test("?text=valid&next=1", async () => {
			try {
				const res = await request(app)
					.get("/word")
					.query({ text: "서", next: 1 });

				expect(res.statusCode).toEqual(200);
				expect("words" in res.body).toEqual(true);
				expect("next" in res.body).toEqual(true);
			} catch (err) {
				throw err;
			}
		});

		test("?text=", async() => {
			try {
				const res = await request(app)
					.get("/word")
					.query({ text: "" });

				expect(res.statusCode).toEqual(400);
			} catch (err) {
				throw err;
			}
		});

		test("?text=[space][tab]", async () => {
			try {
				const res = await request(app)
					.get("/word")
					.query({ text: " \t" });

				expect(res.statusCode).toEqual(400);
			} catch (err) {
				throw err;
			}
		});

		test("?next=1", async () => {
			try {
				const res = await request(app)
					.get("/word")
					.query({ next: 1 });

				expect(res.statusCode).toEqual(400);
			} catch (err) {
				throw err;
			}
		});

		test("?text=valid&next=invalid", async () => {
			try {
				const res = await request(app)
					.get("/word")
					.query({ text: "서", next: "1sdf" });

				expect(res.statusCode).toEqual(400);
			} catch (err) {
				throw err;
			}
		});

		test("no query", async () => {
			try {
				const res = await request(app)
					.get("/word");

				expect(res.statusCode).toEqual(400);
			} catch (err) {
				throw err;
			}
		});
	});
		
});