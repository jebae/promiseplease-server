const voteLocation = (sequelize, DataTypes) => {
	const VoteLocation = sequelize.define("vote_location", {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		address: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		type: {
			type: DataTypes.STRING,
			defaultValue: "당일"
		},
		latitude: DataTypes.DOUBLE,
		longitude: DataTypes.DOUBLE,
	});

	VoteLocation.associate = (models) => {
		VoteLocation.belongsTo(models.District, {
			foreignKey: {
				name: "districtId",
				allowNull: false,
			},
			targetKey: "id"
		});
	}

	VoteLocation.findByDistrict = async (districtId) => {
		try {
			const [ locations ] = await sequelize.query(`
				SELECT
					address, latitude, longitude, type
				FROM
					vote_locations
				WHERE
					"districtId" = '${districtId}'
			`);

			return locations;
		} catch (err) {
			throw err;
		}
	}

	VoteLocation.findByConstituency = async (constituencyId) => {
		try {
			const voteLocations = [];
			const [ districts ] = await sequelize.query(`
				SELECT
					districts.id, districts.name
				FROM
					districts
				INNER JOIN
					district_constituency AS bridge
					ON bridge."districtId" = districts.id
				INNER JOIN
					constituencies
					ON bridge."constituencyId" = constituencies.id AND constituencies.id = '${constituencyId}'
			`);
			if (districts.length === 0)
				return [];

			for (let district of districts) {
				const locations = await VoteLocation.findAll({
					where: { districtId: district.id },
					attributes: [ "address", "type", "latitude", "longitude", ]
				});
				voteLocations.push({ name: district.name, locations });
			}

			return voteLocations;
		} catch (err) {
			throw err;
		}
	}
	return VoteLocation;
};

export default voteLocation;