import models from "../models";

const { Word, } = models;

export const search = async (req, res, _next_) => {
	try {
		let { text, next } = req.query;
		if (!text || text.replace(/[\s\t]/g, "").length === 0) {
			res.status(400).send();
			_next_();
			return ;
		}
		if (next === undefined || next === null) {
			next = 0;
		} else if (/^\d+$/.exec(next) === null) {
			res.status(400).send();
			_next_();
			return ;
		} else {
			next = parseInt(next);
		}

		const [ words, n ] = await Word.search({ text, next });
		res.status(200).json({ words, next: n });
		_next_();
	} catch (err) {
		_next_(err);
	}
}