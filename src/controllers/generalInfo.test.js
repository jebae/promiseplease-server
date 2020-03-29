import { generalInfoController } from ".";
import MockReq from "../../.test_utils/mockRequest";
import MockRes from "../../.test_utils/mockResponse";

const { voterCount, } = generalInfoController;

describe("controller.generalInfo", () => {
	let next = jest.fn();

	beforeEach(() => {
		next.mockReset();
	});

	test("voterCount", async () => {
		try {
			const req = new MockReq({});
			const jsonArg = {};
			const res = new MockRes({ jsonArg });

			await voterCount(req, res, next);
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledTimes(1);
			expect(typeof jsonArg.count).toEqual("number");
			expect(next).toHaveBeenCalledTimes(1);
		} catch (err) {
			throw err;
		}
	});
});