const candidate = (sequelize, DataTypes) => {
	const Candidate = sequelize.define("candidate", {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		number: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		birth: DataTypes.DATEONLY,
		gender: DataTypes.STRING,
		job: DataTypes.STRING,
		education: DataTypes.STRING,
		careers: DataTypes.ARRAY(DataTypes.STRING),
		code: DataTypes.STRING,
	});

	Candidate.associate = (models) => {
		Candidate.belongsTo(models.Party, {
			foreignKey: "partyId",
			targetKey: "id",
		});

		Candidate.belongsTo(models.Constituency, {
			foreignKey: {
				name: "constituencyId",
				allowNull: false,
			},
			targetKey: "id",
		});

		Candidate.hasMany(models.ElectionPromise, {
			foreignKey: "candidateId",
			sourceKey: "id",
			onDelete: "cascade",
			as: {
				singular: "promise",
				plural: "promises",
			}
		});
	}

	Candidate.findByConstituency = async (constituencyId) => {
		try {
			let [ candidates ] = await sequelize.query(`
				SELECT
					candidates.id,
					candidates.name,
					candidates.number,
					candidates.gender,
					candidates.careers,
					TO_CHAR(birth, 'YYYY-MM-DD') as birth,
					parties.color as color,
					parties.name as party,
					(SELECT
						json_agg(json_build_object(
							'cat', promises.category,
							'content', promises.content
						))
					FROM
						election_promises AS promises
					WHERE
						promises."candidateId" = candidates.id
					) AS promises
				FROM
					candidates
				LEFT OUTER JOIN
					parties ON parties.id = candidates."partyId"
				WHERE
					candidates."constituencyId" = '${constituencyId}'
			`);
			if (candidates.length === 0)
				return [];

			candidates.forEach(item => {
				delete item.id;
				if (item.promises === null)
					item.promises = [];
			});
			return candidates;
		} catch (err) {
			throw err;
		}
	}

	Candidate.countAll = async () => {
		try {
			const [ count ] = await sequelize.query(`
				SELECT CAST(count(id) AS INTEGER) AS count FROM candidates
			`);

			return count[0].count;
		} catch (err) {
			throw err;
		}
	};

	Candidate.countByCityGender = async () => {
		try {
			const [ counts ] = await sequelize.query(`
				SELECT
					cities.name AS city,
					CAST(SUM(CASE WHEN gender = 'man' THEN 1 ELSE 0 END) AS INTEGER) AS man,
					CAST(SUM(CASE WHEN gender = 'woman' THEN 1 ELSE 0 END) AS INTEGER) AS woman
				FROM
					candidates
				INNER JOIN
					constituencies ON constituencies.id = candidates."constituencyId"
				INNER JOIN
					cities ON cities.id = constituencies."cityId"
				GROUP BY
					cities.id
			`);
			return counts;
		} catch (err) {
			throw err;
		}
	}

	Candidate.countByGender = async () => {
		try {
			const [ counts ] = await sequelize.query(`
				SELECT
					CAST(SUM(CASE WHEN gender = 'man' THEN 1 ELSE 0 END) AS INTEGER) AS man,
					CAST(SUM(CASE WHEN gender = 'woman' THEN 1 ELSE 0 END) AS INTEGER) AS woman
				FROM
					candidates
			`);
			return counts[0];
		} catch (err) {
			throw err;
		}
	}

	Candidate.aggregateAge = async (aggregate) => {
		try {
			const types = {
				avg: "AVG",
				min: "MIN",
				max: "MAX",
			};
			if (!(aggregate in types))
				return null;
			const [ age ] = await sequelize.query(`
				SELECT
					EXTRACT(YEAR FROM ${types[aggregate]}(age(birth))) AS age
				FROM
					candidates
			`);
			return age[0].age;
		} catch (err) {
			throw err;
		}
	}

	Candidate.countByGenerationJob = async () => {
		try {
			const [ counts ] = await sequelize.query(`
				SELECT
					CAST(t1.generation AS INTEGER) AS generation,
					json_agg(json_build_object('job', job, 'count', count) ORDER BY count DESC) AS jobs,
					CAST(SUM(count) AS INTEGER) AS total
				FROM
					(SELECT
						TRUNC(
							CAST(
								EXTRACT(YEAR FROM age(birth)) AS INTEGER
							),
						-1) AS generation,
						job,
						count(candidates.id) AS count
					FROM
						candidates
					GROUP BY
						generation,
						job
					) AS t1
				GROUP BY
					t1.generation
				ORDER BY
					t1.generation
			`);
			return counts;
		} catch (err) {
			throw err;
		}
	}

	return Candidate;
}

export default candidate;