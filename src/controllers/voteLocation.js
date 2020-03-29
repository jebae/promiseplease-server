import models from "../models";

const { VoteLocation, Constituency } = models;

export const findByCityConstituency = async (req, res, next) => {
	try {
		const { constituency, city } = req.query;
		if (!constituency || !city) {
			res.status(400).send();
			next();
			return ;
		}

		const constituencyQ = await Constituency.findByNameCity({
			name: constituency,
			city,
		});
		if (!constituencyQ) {
			res.status(400).send();
			next();
			return ;
		}

		const locations = await VoteLocation.findByConstituency(constituencyQ.id);
		res.status(200).json({ locations });
		next();
	} catch (err) {
		next(err);
	}
}