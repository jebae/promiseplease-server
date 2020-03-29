import { partyController } from ".";
import MockReq from "../../.test_utils/mockRequest";
import MockRes from "../../.test_utils/mockResponse";

const { countAll, } = partyController;

describe("controller.party", () => {
	let next = jest.fn();

	beforeEach(() => {
		next.mockReset();
	});

	test("countAll", async () => {
		try {
			const req = new MockReq({});
			const jsonArg = {};
			const res = new MockRes({ jsonArg });

			await countAll(req, res, next);
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledTimes(1);
			expect(typeof jsonArg.count).toEqual("number");
			expect(next).toHaveBeenCalledTimes(1);
		} catch (err) {
			throw err;
		}
	});
});