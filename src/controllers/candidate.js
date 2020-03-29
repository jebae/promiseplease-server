import models from "../models";

const { Candidate, Constituency } = models;

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

		const candidates = await Candidate.findByConstituency(constituencyQ.id);
		res.status(200).json({ candidates });
		next();
	} catch (err) {
		next(err);
	}
}

const countAll = async () => {
	try {
		return await Candidate.countAll();
	} catch (err) {
		throw err;
	}
}

const countByCityGender = async (req, res, next) => {
	try {
		return await Candidate.countByCityGender();
	} catch (err) {
		throw err;
	}
}

const countByGender = async () => {
	try {
		return await Candidate.countByGender();
	} catch (err) {
		throw err;
	}
}

const countByGenerationJob = async () => {
	try {
		let count = await Candidate.countByGenerationJob();

		count = count.map(item => {
			const jobs = {};
			let top5 = 0;

			for (let job of item.jobs.slice(0, 5)) {
				jobs[job.job] = job.count;
				top5 += job.count;
			}
			if (item.jobs.length > 5)
				jobs["기타"] = item.total - top5;
			return {
				generation: item.generation,
				...jobs,
			}
		});
		return count;
	} catch (err) {
		throw err;
	}
}

export const count = async (req, res, next) => {
	try {
		let count;
		const { groupby } = req.query;

		if (!groupby) {
			count = await countAll();
			res.status(200).json({ count });
			next();
			return ;
		}

		switch (groupby) {
			case JSON.stringify([ "gender" ]):
				count = await countByGender();
				res.status(200).json({ count });
				break ;
			case JSON.stringify([ "city", "gender" ]):
				count = await countByCityGender();
				res.status(200).json({ count });
				break ;
			case JSON.stringify([ "generation", "job" ]):
				count = await countByGenerationJob();
				res.status(200).json({ count });
				break ;
			default:
				res.status(400).send();
		}
		next();
	} catch (err) {
		next(err);
	}
}

export const aggregateAge = async (req, res, next) => {
	try {
		const { aggregate } = req.query;
		if (!aggregate) {
			res.status(400).send();
			next();
			return ;
		}

		const age = await Candidate.aggregateAge(aggregate);
		if (!age) {
			res.status(400).send();
			next();
			return ;
		}

		res.status(200).json({ age });
		next();
	} catch (err) {
		next(err);
	}
}