const constituency = (sequelize, DataTypes) => {
	const Constituency = sequelize.define("constituency", {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		code: DataTypes.STRING,
	});

	Constituency.associate = (models) => {
		Constituency.hasMany(models.Candidate, {
			foreignKey: "constituencyId",
			sourceKey: "id",
			onDelete: "cascade",
		});

		Constituency.hasMany(models.Word, {
			foreignKey: "constituencyId",
			sourceKey: "id",
			onDelete: "cascade",
		});

		Constituency.belongsTo(models.City, {
			foreignKey: {
				name: "cityId",
				allowNull: false,
			},
			targetKey: "id",
		});

		Constituency.belongsToMany(models.District, {
			through: "district_constituency",
			foreignKey: "constituencyId",
			otherKey: "districtId",
		});
	}

	Constituency.findByNameCity = async ({ name, city }) => {
		try {
			const [ constituency ] = await sequelize.query(`
				SELECT
					constituencies.id, constituencies.name, constituencies.code
				FROM
					constituencies
				INNER JOIN
					cities ON cities.id = constituencies."cityId"
				WHERE
					cities.name = '${city}' and constituencies.name = '${name}'
			`);

			if (constituency.length === 0)
				return null;
			return constituency[0];
		} catch (err) {
			throw err;
		}
	}

	return Constituency;
};

export default constituency;