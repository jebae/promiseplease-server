import { candidateController } from ".";
import MockReq from "../../.test_utils/mockRequest";
import MockRes from "../../.test_utils/mockResponse";

const {
	findByCityConstituency,
	count,
	aggregateAge,
} = candidateController;

describe("controller.candidate", () => {
	let next = jest.fn();

	beforeEach(() => {
		next.mockReset();
	});

	describe("findByCityConstituency", () => {
		const expect400 = async (req, res, next) => {
			try {
				await findByCityConstituency(req, res, next);
				expect(res.status).toHaveBeenCalledWith(400);
				expect(next).toHaveBeenCalledTimes(1);
			} catch (err) {
				throw err;
			}
		}

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
				expect("candidates" in jsonArg).toEqual(true);
				expect(typeof jsonArg.candidates).toEqual("object");
				expect(next).toHaveBeenCalledTimes(1);
			} catch (err) {
				throw err;
			}
		});

		test("constituency not exist", async () => {
			try {
				const req = new MockReq({
					query: {
						city: "부산",
						constituency: "없는구갑",
					}
				});
				const res = new MockRes({});
	
				await expect400(req, res, next);
			} catch (err) {
				throw err;
			}
		});

		test("no city", async () => {
			try {
				const req = new MockReq({
					query: {
						constituency: "사하구갑",
					}
				});
				const res = new MockRes({});
	
				await expect400(req, res, next);
			} catch (err) {
				throw err;
			}
		});

		test("no constituency", async () => {
			try {
				const req = new MockReq({
					query: {
						city: "부산",
					}
				});
				const res = new MockRes({});
	
				await expect400(req, res, next);
			} catch (err) {
				throw err;
			}
		});

		test("no query", async () => {
			try {
				const req = new MockReq({});
				const res = new MockRes({});
	
				await expect400(req, res, next);
			} catch (err) {
				throw err;
			}
		});
	});

	describe("count", () => {
		test("countAll", async () => {
			try {
				const req = new MockReq({});
				const jsonArg = {};
				const res = new MockRes({ jsonArg });
	
				await count(req, res, next);
				expect(res.status).toHaveBeenCalledWith(200);
				expect(res.json).toHaveBeenCalledTimes(1);
				expect("count" in jsonArg).toEqual(true);
				expect(typeof jsonArg.count).toEqual("number");
				expect(next).toHaveBeenCalledTimes(1);
			} catch (err) {
				throw err;
			}	
		});
	
		test("countByCityGender", async () => {
			try {
				const req = new MockReq({
					query: {
						groupby: JSON.stringify([ "city", "gender" ])
					}
				});
				const jsonArg = {};
				const res = new MockRes({ jsonArg });
	
				await count(req, res, next);
				expect(res.status).toHaveBeenCalledWith(200);
				expect(res.json).toHaveBeenCalledTimes(1);
				expect("count" in jsonArg).toEqual(true);
				expect(typeof jsonArg.count).toEqual("object");
				jsonArg.count.forEach(item => {
					expect(typeof item.city).toEqual("string");
					expect(typeof item.man).toEqual("number");
					expect(typeof item.woman).toEqual("number");
				});
				expect(next).toHaveBeenCalledTimes(1);
			} catch (err) {
				throw err;
			}	
		});
	
		test("countByGender", async () => {
			try {
				const req = new MockReq({
					query: {
						groupby: JSON.stringify([ "gender" ])
					}
				});
				const jsonArg = {};
				const res = new MockRes({ jsonArg });
		
				await count(req, res, next);
				expect(res.status).toHaveBeenCalledWith(200);
				expect(res.json).toHaveBeenCalledTimes(1);
				expect("count" in jsonArg).toEqual(true);
				expect(typeof jsonArg.count).toEqual("object");
				expect(typeof jsonArg.count.man).toEqual("number");
				expect(typeof jsonArg.count.woman).toEqual("number");
				expect(next).toHaveBeenCalledTimes(1);	
			} catch (err) {
				throw err;
			}
		});
	
		test("countByGenerationJob", async () => {
			try {
				const req = new MockReq({
					query: {
						groupby: JSON.stringify([ "generation", "job" ])
					}
				});
				const jsonArg = {};
				const res = new MockRes({ jsonArg });
	
				await count(req, res, next);
				expect(res.status).toHaveBeenCalledWith(200);
				expect(res.json).toHaveBeenCalledTimes(1);
				expect(typeof jsonArg.count).toEqual("object");
				jsonArg.count.forEach(item => {
					expect(typeof item.generation).toEqual("number");
					expect("jobs" in item).toEqual(false);
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
		
		test("invalid query", async () => {
			try {
				const req = new MockReq({
					query: {
						groupby: "gender"
					}
				});
				const jsonArg = {};
				const res = new MockRes({ jsonArg });

				await count(req, res, next);
				expect(res.status).toHaveBeenCalledWith(400);
				expect(next).toHaveBeenCalledTimes(1);
			} catch (err) {
				throw err;
			}
		});
	});

	describe("aggregateAge", () => {
		const aggregateTest = async (type) => {
			try {
				const req = new MockReq({
					query: {
						aggregate: type,
					},
				});
				const jsonArg = {};
				const res = new MockRes({ jsonArg });
	
				await aggregateAge(req, res, next);
				expect(res.status).toHaveBeenCalledWith(200);
				expect(res.json).toHaveBeenCalledTimes(1);
				expect(typeof jsonArg.age).toEqual("number");
				expect(next).toHaveBeenCalledTimes(1);
			} catch (err) {
				throw err;
			}
		}

		test("avg", async () => {
			try {
				await aggregateTest("avg");
			} catch (err) {
				throw err;
			}
		});

		test("min", async () => {
			try {
				await aggregateTest("min");
			} catch (err) {
				throw err;
			}
		});

		test("max", async () => {
			try {
				await aggregateTest("max");
			} catch (err) {
				throw err;
			}
		});

		test("invalid aggregate", async () => {
			try {
				const req = new MockReq({
					query: {
						aggregate: "invalid aggregate",
					},
				});
				const jsonArg = {};
				const res = new MockRes({ jsonArg });
	
				await aggregateAge(req, res, next);
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
	
				await aggregateAge(req, res, next);
				expect(res.status).toHaveBeenCalledWith(400);
				expect(next).toHaveBeenCalledTimes(1);			
			} catch (err) {
				throw err;
			}
		});
	});
});