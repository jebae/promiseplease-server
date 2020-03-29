import models from "../models";

const { ElectionPromise, } = models;

const countByCityCategory = async () => {
	try {
		let count = await ElectionPromise.countByCityCategory();

		count = count.map(item => {
			const cats = {};
			let top5 = 0;

			for (let cat of item.cats.slice(0, 5)) {
				cats[cat.cat] = cat.count;
				top5 += cat.count;
			}
			if (item.cats.length > 5)
				cats["기타"] = item.total - top5;
			return {
				city: item.city,
				...cats,
			}
		});
		return count;
	} catch (err) {
		throw err;
	}
}

const countByCategory  = async () => {
	try {
		let count = await ElectionPromise.countByCategory();
		if (count.length <= 10)
			return count;

		const top10 = count.slice(0, 10)
			.reduce((acc, cur) => acc + cur.count, 0);
		const total = top10 + count.slice(10)
			.reduce((acc, cur) => acc + cur.count, 0);

		count = count.slice(0, 10);
		count.push({ cat: "기타", count: total - top10 });
		return count;
	} catch (err) {
		throw err;
	}
}

export const count = async (req, res, next) => {
	try {
		let count;
		const { groupby } = req.query;

		switch (groupby) {
			case JSON.stringify([ "category" ]):
				count = await countByCategory();
				res.status(200).json({ count })
				break ;

			case JSON.stringify([ "city", "category" ]):
				count = await countByCityCategory();
				res.status(200).json({ count })
				break ;
			default:
				res.status(400).send();
		}
		next();
	} catch (err) {
		next(err);
	}
}