import models from "../models";

const { GeneralInfo, } = models;

export const voterCount = async (req, res, next) => {
	try {
		const count = await GeneralInfo.voterCount();

		res.status(200).json({ count });
		next();
	} catch (err) {
		next(err);
	}
}