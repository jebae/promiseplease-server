import models from "../models";

const { Party, } = models;

export const countAll = async (req, res, next) => {
	try {
		const count = await Party.countAll();

		res.status(200).json({ count });
		next();
	} catch (err) {
		next(err);
	}
}