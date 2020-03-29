const district = (sequelize, DataTypes) => {
	const District = sequelize.define("district", {
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

	District.associate = (models) => {
		District.hasMany(models.VoteLocation, {
			foreignKey: "districtId",
			sourceKey: "id",
			onDelete: "cascade",
		});

		District.belongsTo(models.City, {
			foreignKey: {
				name: "cityId",
				allowNull: false,
			},
			targetKey: "id",
		});

		District.belongsToMany(models.Constituency, {
			through: "district_constituency",
			foreignKey: "districtId",
			otherKey: "constituencyId",
		});
	}

	return District;
};

export default district;