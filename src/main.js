import { config as envConfig } from "dotenv";
import { sequelize } from "./models";
import app from "./server";

envConfig();

sequelize.sync()
	.then(() => {
		app.listen(process.env.PORT, () => console.log(
			`Server running on ${process.env.PORT}`
		));
	});