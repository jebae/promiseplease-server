import { errorHandler } from ".";
import MockRes from "../../.test_utils/mockResponse";
import nodemailer from "nodemailer";

describe("errorHandler", () => {
	let next = jest.fn();

	beforeEach(() => {
		next.mockReset();
	});

	test("errorHandle", async () => {
		try {
			const res = new MockRes({});
			const mockTransporter = { sendMail: jest.fn() };
			jest.spyOn(nodemailer, "createTransport").mockImplementation(() => mockTransporter);
			await errorHandler({}, {}, res, next);

			expect(res.status).toHaveBeenCalledWith(500);
			expect(nodemailer.createTransport).toHaveBeenCalledTimes(1);
			expect(mockTransporter.sendMail).toHaveBeenCalledTimes(1);
			expect(next).toHaveBeenCalledTimes(1);
			nodemailer.createTransport.mockRestore();
		} catch (err) {
			throw err;
		}
	});

	test.skip("real mail", async () => {
		try {
			const res = new MockRes({});
			const mockTransporter = { sendMail: jest.fn() };
			await errorHandler(Error("Error!!"), {}, res, next);
		} catch (err) {
			throw err;
		}	
	});
});