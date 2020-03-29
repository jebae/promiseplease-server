import { electionPromiseController } from ".";
import MockReq from "../../.test_utils/mockRequest";
import MockRes from "../../.test_utils/mockResponse";

const { count, } = electionPromiseController;

describe("controller.electionPromise", () => {
	let next = jest.fn();

	beforeEach(() => {
		next.mockReset();
	});

	describe("count", () => {
		test("countByCityCategory", async () => {
			try {
				const req = new MockReq({
					query: {
						groupby: JSON.stringify([ "city", "category" ])
					}
				});
				const jsonArg = {};
				const res = new MockRes({ jsonArg });
	
				await count(req, res, next);
				expect(res.status).toHaveBeenCalledWith(200);
				expect(res.json).toHaveBeenCalledTimes(1);
				expect(typeof jsonArg.count).toEqual("object");
				jsonArg.count.forEach(item => {
					expect(typeof item.city).toEqual("string");
					expect("cats" in item).toEqual(false);
					expect("total" in item).toEqual(false);
					if (Object.keys(item).length === 7) {
						expect("기타" in item).toEqual(true);
					}
				});
				expect(next).toHaveBeenCalledTimes(1);
			} catch (err) {
				throw err;
			}
		});
	
		test("countByCategory", async () => {
			try {
				const req = new MockReq({
					query: {
						groupby: JSON.stringify([ "category" ])
					}
				});
				const jsonArg = {};
				const res = new MockRes({ jsonArg });
				let etcExist = false;
	
				await count(req, res, next);
				expect(res.status).toHaveBeenCalledWith(200);
				expect(res.json).toHaveBeenCalledTimes(1);
				expect(typeof jsonArg.count).toEqual("object");
				expect(jsonArg.count).toHaveLength(11);
				jsonArg.count.forEach(item => {
					expect(typeof item.cat).toEqual("string");
					expect(typeof item.count).toEqual("number");
					if (item.cat === "기타")
						etcExist = true;
				});
				expect(etcExist).toEqual(true);
				expect(next).toHaveBeenCalledTimes(1);
			} catch (err) {
				throw err;
			}
		});
	});
});