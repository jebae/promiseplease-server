const electionPromise = (sequelize, DataTypes) => {
	const ElectionPromise = sequelize.define("election_promise", {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		content: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		category: DataTypes.ARRAY(DataTypes.STRING),
	});

	ElectionPromise.associate = (models) => {
		ElectionPromise.belongsTo(models.Candidate, {
			foreignKey: "candidateId",
			targetKey: "id",
		});

		ElectionPromise.belongsTo(models.Party, {
			foreignKey: "partyId",
			targetKey: "id",
		});
	}

	ElectionPromise.countByCategory = async () => {
		try {
			const [ counts ] = await sequelize.query(`
				SELECT
					cat,
					CAST(count(*) AS INTEGER) AS count
				FROM
					(SELECT
						unnest(category) AS cat
					FROM
						election_promises
					) AS t1
				GROUP BY
					cat
				ORDER BY
					count DESC
			`);

			return counts;
		} catch (err) {
			throw err;
		}
	}

	ElectionPromise.countByCityCategory = async () => {
		try {
			const [ counts ] = await sequelize.query(`
				SELECT
					t2.city,
					json_agg(json_build_object('cat', cat, 'count', count) ORDER BY count DESC) AS cats,
					CAST(SUM(count) AS INTEGER) AS total
				FROM
					(SELECT
						cities.name AS city,
						t1.cat,
						count(t1.cat) AS count
					FROM
						(SELECT
							"candidateId",
							unnest(category) AS cat
						FROM
							election_promises
					) AS t1
					INNER JOIN
						candidates ON candidates.id = t1."candidateId"
					INNER JOIN
						constituencies ON constituencies.id = candidates."constituencyId"
					INNER JOIN
						cities ON cities.id = constituencies."cityId"
					GROUP BY
						cities.id,
						t1.cat
					) AS t2
				GROUP BY
					t2.city
				ORDER BY
					total DESC
			`);
			return counts;
		} catch (err) {
			throw err;
		}
	}
	return ElectionPromise;
};

export default electionPromise;