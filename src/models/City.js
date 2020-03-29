const city = (sequelize, DataTypes) => {
	const City = sequelize.define("city", {
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

	City.associate = (models) => {
		City.hasMany(models.District, {
			foreignKey: "cityId",
			sourceKey: "id",
			onDelete: "cascade",
		});

		City.hasMany(models.Constituency, {
			foreignKey: "cityId",
			sourceKey: "id",
			onDelete: "cascade",
		});
	}
	return City;
};

export default city;