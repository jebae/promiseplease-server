const NUM_PER_PAGE = 10;

const word = (sequelize, DataTypes) => {
	const Word = sequelize.define("word", {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		text: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		type: DataTypes.STRING,
	});

	Word.associate = (models) => {
		Word.belongsTo(models.Constituency, {
			foreignKey: {
				name: "constituencyId",
				allowNull: false,
			},
			targetKey: "id"
		});
	}

	Word.search = async ({ text, next }) => {
		try {
			text = text.replace(/[\s\t]/g, "");
			if (text.length === 0 || typeof next !== "number")
				return [ [], null ];
			next = parseInt(next);
			const [ words ] = await sequelize.query(`
				SELECT
					t2.text AS word,
					t2.type,
					t2.constituency,
					t2.city
				FROM
					(SELECT
						t1.wid, text, text_no_space, type, constituencies.name AS constituency,
						(SELECT cities.name AS city FROM cities WHERE cities.id = constituencies."cityId"),
						(CASE
							WHEN text_no_space LIKE '${text}%' THEN 1
							WHEN text_no_space LIKE '%${text}%' THEN 2
						END) AS sim,
						(CASE
							WHEN type = '지역' THEN 1
							WHEN type = '후보' THEN 2
						END) AS priority
					FROM
						(SELECT
							id AS wid, REPLACE(text, ' ', '') AS text_no_space, text, type, "constituencyId"
						FROM
							words
						) AS t1
					INNER JOIN
						constituencies ON constituencies.id = t1."constituencyId"
					WHERE
						text_no_space LIKE '%${text}%'
					) AS t2
				ORDER BY
					t2.sim ASC,
					t2.priority ASC,
					t2.wid ASC
				OFFSET '${next * NUM_PER_PAGE}' LIMIT ${NUM_PER_PAGE + 1}
			`);
			if (words.length === NUM_PER_PAGE + 1)
				next++;
			else
				next = null;
			return [ words.slice(0, NUM_PER_PAGE), next ];
		} catch (err) {
			throw err;
		}
	}

	return Word;
};

export default word;