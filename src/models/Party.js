const party = (sequelize, DataTypes) => {
	const Party = sequelize.define("party", {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		color: DataTypes.STRING,
		code: DataTypes.STRING,
	});

	Party.associate = (models) => {
		Party.hasMany(models.Candidate, {
			foreignKey: "partyId",
			sourceKey: "id",
		});

		Party.hasMany(models.ElectionPromise, {
			foreignKey: "partyId",
			sourceKey: "id",
			onDelete: "cascade",
			as: {
				singular: "promise",
				plural: "promises",
			}
		});
	}

	Party.countAll = async () => {
		try {
			const [ count ] = await sequelize.query(`
				SELECT
					count(*)
				FROM
					parties
			`);

			return parseInt(count[0].count);
		} catch (err) {
			throw err;
		}
	}
	return Party;
};

export default party;