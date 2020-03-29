const generalInfo = (sequelize, DataTypes) => {
	const GeneralInfo = sequelize.define("generalinfo", {
		voterCount: DataTypes.INTEGER,
	});

	GeneralInfo.voterCount = async () => {
		try {
			const [ count ] = await sequelize.query(`
				SELECT
					"voterCount"
				FROM
					generalinfos
			`);

			if (count)
				return parseInt(count[0].voterCount);
			return 0;
		} catch (err) {
			throw err;
		}
	}

	return GeneralInfo;
};

export default generalInfo;