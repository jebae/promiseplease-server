import { voteLocationController } from ".";
import MockReq from "../../.test_utils/mockRequest";
import MockRes from "../../.test_utils/mockResponse";

const { findByCityConstituency } = voteLocationController;

describe("controller.voteLocation", () => {
	let next = jest.fn();

	beforeEach(() => {
		next.mockReset();
	});

	describe("findByCityConstituency", () => {
		test("constituency exist", async () => {
			try {
				const req = new MockReq({
					query: {
						city: "대전",
						constituency: "서구을",
					}
				});
				const jsonArg = {};
				const res = new MockRes({ jsonArg });

				await findByCityConstituency(req, res, next);
				expect(res.status).toHaveBeenCalledWith(200);
				expect(res.json).toHaveBeenCalledTimes(1);
				expect("locations" in jsonArg).toEqual(true);
				expect(typeof jsonArg.locations).toEqual("object");
				jsonArg.locations.forEach(loc => {
					expect(typeof loc.name).toEqual("string");
					expect(typeof loc.locations).toEqual("object");
				});
				expect(next).toHaveBeenCalledTimes(1);
			} catch (err) {
				throw err;
			}
		});

		test("constituency not exist", async () => {
			try {
				const req = new MockReq({
					query: {
						city: "대전",
						constituency: "not exist",
					}
				});
				const jsonArg = {};
				const res = new MockRes({ jsonArg });

				await findByCityConstituency(req, res, next);
				expect(res.status).toHaveBeenCalledWith(400);
				expect(next).toHaveBeenCalledTimes(1);
			} catch (err) {
				throw err;
			}
		});

		test("no query", async () => {
			try {
				const req = new MockReq({});
				const jsonArg = {};
				const res = new MockRes({ jsonArg });

				await findByCityConstituency(req, res, next);
				expect(res.status).toHaveBeenCalledWith(400);
				expect(next).toHaveBeenCalledTimes(1);
			} catch (err) {
				throw err;
			}
		});
	});
});