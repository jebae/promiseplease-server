import Sequelize from "sequelize";
if (process.env.NODE_ENV === "development")
	require("dotenv").config({ path: "./.env.dev" });
else
	require("dotenv").config({ path: "./.env.prod" });

const { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD } = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
	host: DB_HOST,
	dialect: "postgres",
	logging: false,
	dialectOptions: { decimalNumbers: true },
});

const models = {
	Candidate: sequelize.import("./Candidate"),
	Party: sequelize.import("./Party"),
	City: sequelize.import("./City"),
	Constituency: sequelize.import("./Constituency"),
	District: sequelize.import("./District"),
	VoteLocation: sequelize.import("./VoteLocation"),
	ElectionPromise: sequelize.import("./ElectionPromise"),
	Word: sequelize.import("./Word"),
	GeneralInfo: sequelize.import("./GeneralInfo"),
};

Object.keys(models).forEach(key => {
	if ("associate" in models[key])
		models[key].associate(models);
});

export {
	sequelize
}
export default models;