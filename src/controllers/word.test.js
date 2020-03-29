import { wordController } from ".";
import MockReq from "../../.test_utils/mockRequest";
import MockRes from "../../.test_utils/mockResponse";

const { search, } = wordController;

describe("controller.word", () => {
	let _next_ = jest.fn();

	beforeEach(() => {
		_next_.mockReset();
	});

	describe("search", () => {
		const attrs = [ "word", "city", "constituency", "type" ];
		const wordsAttrsTest = (words, text) => {
			words.forEach(word => {
				attrs.forEach(attr => {
					expect(attr in word).toEqual(true);
				});
				expect(word.word.search(text)).not.toEqual(-1);
				expect(typeof word.city).toEqual("string");
				expect(typeof word.constituency).toEqual("string");
				expect(typeof word.type).toEqual("string");
			});
		}

		const expect400 = async (req, res, _next_) => {
			try {
				await search(req, res, _next_);
				expect(res.status).toHaveBeenCalledWith(400);
				expect(_next_).toHaveBeenCalledTimes(1);
			} catch (err) {
				throw err;
			}
		}

		test("first page", async () => {
			try {
				const text = "서";
				const req = new MockReq({
					query: {
						text,
						next: null
					},
				});
				const jsonArg = {};
				const res = new MockRes({ jsonArg });

				await search(req, res, _next_);
				expect(res.status).toHaveBeenCalledWith(200);
				expect(res.json).toHaveBeenCalledTimes(1);
				expect(jsonArg.next).toEqual(1);
				expect(typeof jsonArg.words).toEqual("object");
				expect(jsonArg.words).toHaveLength(10);
				wordsAttrsTest(jsonArg.words, text);
				expect(_next_).toHaveBeenCalledTimes(1);
			} catch (err) {
				throw err;
			}
		});

		test("next page", async () => {
			try {
				const text = "서";
				const req = new MockReq({
					query: {
						text,
						next: 1
					},
				});
				const jsonArg = {};
				const res = new MockRes({ jsonArg });

				await search(req, res, _next_);
				expect(res.status).toHaveBeenCalledWith(200);
				expect(res.json).toHaveBeenCalledTimes(1);
				expect(jsonArg.next).toEqual(null);
				expect(typeof jsonArg.words).toEqual("object");
				expect(jsonArg.words.length).toBeLessThan(10);
				wordsAttrsTest(jsonArg.words, text);
				expect(_next_).toHaveBeenCalledTimes(1);
			} catch (err) {
				throw err;
			}		
		});

		test("text == ''", async () => {
			try {
				const text = "";
				const req = new MockReq({
					query: {
						text,
						next: null
					},
				});
				const jsonArg = {};
				const res = new MockRes({ jsonArg });

				await expect400(req, res, _next_);
			} catch (err) {
				throw err;
			}		
		});

		test("text == ' \t'", async () => {
			try {
				const text = " \t";
				const req = new MockReq({
					query: {
						text,
						next: null
					},
				});
				const jsonArg = {};
				const res = new MockRes({ jsonArg });

				await expect400(req, res, _next_);
			} catch (err) {
				throw err;
			}		
		});

		test("result not exist", async () => {
			try {
				const text = "not exist";
				const req = new MockReq({
					query: {
						text,
						next: null
					},
				});
				const jsonArg = {};
				const res = new MockRes({ jsonArg });

				await search(req, res, _next_);
				expect(res.status).toHaveBeenCalledWith(200);
				expect(res.json).toHaveBeenCalledTimes(1);
				expect(jsonArg.next).toEqual(null);
				expect(typeof jsonArg.words).toEqual("object");
				expect(jsonArg.words).toHaveLength(0);
				expect(_next_).toHaveBeenCalledTimes(1);
			} catch (err) {
				throw err;
			}		
		});

		test("query.text == undefined", async () => {
			try {
				const req = new MockReq({
					query : {
						next: null
					}
				});
				const jsonArg = {};
				const res = new MockRes({ jsonArg });

				await expect400(req, res, _next_);
			} catch (err) {
				throw err;
			}
		});

		test("no query", async () => {
			try {
				const req = new MockReq({});
				const jsonArg = {};
				const res = new MockRes({ jsonArg });

				await expect400(req, res, _next_);
			} catch (err) {
				throw err;
			}
		});

		test("invalid next", async () => {
			try {
				const req = new MockReq({
					query: {
						text: "서",
						next: "1sdf",
					}
				});
				const jsonArg = {};
				const res = new MockRes({ jsonArg });

				await expect400(req, res, _next_);
			} catch (err) {
				throw err;
			}
		});
	});
});