import "@babel/polyfill";
import models, { sequelize } from "../src/models";
const {
	City, Constituency, District, VoteLocation,
	Party, Candidate, ElectionPromise,
	GeneralInfo,
	Word
} = models;

const setUpParty = async () => {
	try {
		const parties = [
			{
				name: "닫힌우리당",
				color: "343434",
			},
			{
				name: "각자민주당",
				color: "000000",
			},
			{
				name: "미래분리당",
				color: "ffffff",
			},
			{
				name: "개인혁명독점금당",
				color: "00ff00",
			},
		];

		await Party.bulkCreate(parties);
		const one = await Party.findOne();
	} catch (err) {
		throw err;
	}
}

const setUpCityDistrict = async () => {
	try {
		const cities = [
			{
				name: "서울",
				constituencies: [
					{
						name: "마포구갑",
						district: "마포구",
						voteLocation: [
							"서울특별시 마포구 마포대로",
							"서울특별시 마포구 만리재옛길",
							"서울특별시 마포구 토정로31길",
						]
					},
					{
						name: "마포구을",
						district: "마포구",
						voteLocation: [
							"서울특별시 마포구 월드컵북로30길",
							"서울특별시 마포구 서강로",
						]
					},
					{
						name: "종로구",
						district: "종로구",
						voteLocation: [
							"서울특별시 종로구 보신각로",
							"서울특별시 종로구 평창7길",
							"서울특별시 종로구 삼봉로",
							"서울특별시 종로구 평창문화로",
						]
					},
				]
			},
			{
				name: "대전",
				constituencies: [
					{
						name: "서구갑",
						district: "서구",
						voteLocation: [
							"대전광역시 서구 정림서로",
							"대전광역시 서구 관저로",
						]
					},
					{
						name: "서구을",
						district: "서구",
						voteLocation: [
							"대전광역시 서구 도안동로",
							"대전광역시 서구 둔산중로64번길",
							"대전광역시 서구 청사로",
						]
					},
					{
						name: "중구",
						district: "중구",
						voteLocation: [
							"대전광역시 중구 수침로",
							"대전광역시 중구 태평로",
							"대전광역시 중구 계룡로",
							"대전광역시 중구 계백로1566번길",
						]
					},
				]
			},
			{
				name: "부산",
				constituencies: [
					{
						name: "해운대구갑",
						district: "해운대구",
						voteLocation: [
							"부산광역시 해운대구 대천로67번길",
							"부산광역시 해운대구 양운로",
							"부산광역시 해운대구 대천로103번길",
						]
					},
					{
						name: "사하구갑",
						district: "사하구",
						voteLocation: [
							"부산광역시 사하구 다대낙조2길",
							"부산광역시 사하구 낙동대로",
							"부산광역시 사하구 괴정로",
							"부산광역시 부산진구 신천대로",
						]
					},
				]
			},
			{
				name: "전남",
				constituencies: [
					{
						name: "목포시",
						district: "목포시",
						voteLocation: [
							"전라남도 목포시 포미로",
						]
					},
					{
						name: "영암군무안군신안군",
						district: "영암군",
						voteLocation: [
							"전라남도 영암군 삼향읍 남악4로",
							"전라남도 영암군 삼향읍 이동길",
							"전라남도 영암군 지도읍 원달길"
						]
					},
					{
						name: "영암군무안군신안군",
						district: "무안군",
						voteLocation: [
							"전라남도 무안군 삼향읍 남악4로",
							"전라남도 무안군 삼향읍 이동길",
							"전라남도 무안군 지도읍 원달길"
						]
					}
				]
			},
			{
				name: "충북",
				constituencies: [
					{
						name: "청주시갑",
						district: "청주시상당구",
						voteLocation: [
							"충청북도 청주시 상당구 수영로",
							"충청북도 청주시 상당구 중흥로",

						]
					},
					{
						name: "제천시단양군",
						district: "제천시",
						voteLocation: [
							"충청북도 제천시 칠성로",
							"충청북도 제천시 용두천로",
							"충청북도 제천시 봉양읍 북부로",
						]
					}
				]
			},
		];

		const latlngs = [
			{ latitude: 37.572036, longitude: 126.976594, },
			{ latitude: 37.573800, longitude: 126.972732, },
			{ latitude: 37.581802, longitude: 126.969253, },
			{ latitude: 37.583043, longitude: 126.981977, },
			{ latitude: 37.574321, longitude: 126.985516, },
			{ latitude: 37.569792, longitude: 126.980448, },
			{ latitude: 37.567623, longitude: 126.973367, },
		]

		const types = [ "사전", "당일" ];

		for (let cityObj of cities) {
			const city = await City.create({ name: cityObj.name });
			for (let constituencyObj of cityObj.constituencies) {
				const [ constituency ] = await Constituency.findOrCreate({
					where: {
						name: constituencyObj.name,
						cityId: city.id
					}
				});
				const [ district ] = await District.findOrCreate({
					where: {
						name: constituencyObj.district,
						cityId: city.id,
					}
				});
				await constituency.addDistrict(district);
				const voteLocations = constituencyObj.voteLocation.map(item => {
					const pos = latlngs[parseInt(Math.random() * latlngs.length)];

					return {
						address: item,
						latitude: pos.latitude,
						longitude: pos.longitude,
						districtId: district.id,
						type: types[ parseInt(Math.random() * types.length) ],
					};
				});
				await VoteLocation.bulkCreate(voteLocations);
			}
		}
	} catch (err) {
		throw err;
	}
}

const setUpCandidates = async () => {
	let candidates = [
		{
			name: "김용진",
			birth: "1967-04-05",
			gender: "man",
			job: "정당인",
			education: "동국대학교 언론정보대학원 졸업 (언론학 석사)",
			careers: [
				"(현) 제20대 국회의원",
				"(현) 국회 과학기술정보방송통신위원회 위원장",
			],
			constituency: "마포구갑",
			party: "닫힌우리당",
		},
		{
			name: "박은영",
			birth: "1981-03-21",
			gender: "woman",
			job: "정당인",
			education: "서강대학교 영상대학원 졸업(광고홍보학 박사)",
			careers: [
				"(전)제18대 국회의원",
				"(현)미래통합당 서울시당 수석대변인",
			],
			constituency: "마포구갑",
			party: "각자민주당",
		},
		{
			name: "김민재",
			birth: "1978-12-11",
			gender: "man",
			job: "회사원",
			education: "세명대학교 영어영문학과 졸업",
			careers: [
				"(전)단양군자율방범연합대 사무국장",
				"(현)국가혁명배당금당 당원",
			],
			constituency: "마포구갑",
			party: "개인혁명독점금당",
		},
		{
			name: "이은심",
			birth: "1974-02-11",
			gender: "woman",
			job: "간호조무사",
			education: "제천여자중학교 졸업",
			careers: [
				"(현)문화실버요양병원 간호과 근무",
			],
			constituency: "마포구을",
			party: "닫힌우리당",
		},
		{
			name: "김용식",
			birth: "1977-02-01",
			gender: "man",
			job: "정당인",
			education: "고려대학교 대학원 법학과 석사과정 수료",
			careers: [
				"(전)사)기천문 이사",
				"(현)천문 해동검도 원장",
			],
			constituency: "마포구을",
			party: "각자민주당",
		},
		{
			name: "고순영",
			birth: "1989-11-21",
			gender: "woman",
			job: "회사원",
			education: "동아대학교 기계공학과 졸업",
			careers: [
				"(현)국가혁명배당금당 천안시부위원장",
			],
			constituency: "종로구",
			party: "개인혁명독점금당",
		},
		{
			name: "최민수",
			birth: "1956-12-21",
			gender: "man",
			job: "국회의원",
			education: "성균관대학교 한국철학과 졸업",
			careers: [
				"(현)천안시을 국회의원",
				"(전)더불어민주당 최고위원",
			],
			constituency: "종로구",
			party: null,
		},
		{
			name: "이창수",
			birth: "1976-08-15",
			gender: "man",
			job: "변호사",
			education: "연세대학교 법무대학원 졸업(산업재산권법 법학석사)",
			careers: [
				"(전)천안검찰청 지청장",
				"(전)충청남도 법률자문 검사",
			],
			constituency: "종로구",
			party: "미래분리당",
		},
		{
			name: "최상태",
			birth: "1980-09-15",
			gender: "man",
			job: "자영업",
			education: "서울대학교 행정대학원 졸업(행정학석사)",
			careers: [
				"(전)한국전력 근무",
				"(전)또또유통 대표",
			],
			constituency: "종로구",
			party: "닫힌우리당",
		},
		{
			name: "이귀동",
			birth: "1982-06-25",
			gender: "man",
			job: "정당인",
			education: "고려대학교 농업경제학과 졸업 경제학학사",
			careers: [
				"(전)충청남도 정무부지사",
				"(현)제20대 국회의원",
			],
			constituency: "서구갑",
			party: "닫힌우리당",
		},
		{
			name: "이일용",
			birth: "1984-01-25",
			gender: "man",
			job: "정당인",
			education: "건국대학교 경영정보학과 졸업",
			careers: [
				"(현)제20대 국회의원",
				"(현)더불어민주당 수석대변인",
			],
			constituency: "서구갑",
			party: "각자민주당",
		},
		{
			name: "정아름",
			birth: "1990-01-03",
			gender: "woman",
			job: "피부미용관리사 대표",
			education: "해미고등학교(현 서산고등학교) 졸업",
			careers: [
				"(전) 보험설계사",
				"(현) 피부미용관리사 대표",
			],
			constituency: "서구을",
			party: null,
		},
		{
			name: "이남영",
			birth: "1979-04-03",
			gender: "woman",
			job: "정당인",
			education: "명지실업전문대학(현 명지전문대학) 지적과 졸업",
			careers: [
				"(전) 제7회 지방선거 서산시장후보",
				"(현) 민주노총 서산태안위원회 대표",
			],
			constituency: "서구을",
			party: null,
		},
		{
			name: "이순길",
			birth: "1980-08-13",
			gender: "man",
			job: "엔지니어",
			education: "금산농업고등학교 (현 금산산업고등학교) 졸업",
			careers: [
				"(현) 엔지니어",
			],
			constituency: "서구을",
			party: "개인혁명독점금당",
		},
		{
			name: "정명석",
			birth: "1966-11-11",
			gender: "man",
			job: "(주)삼구아이앤씨 사원",
			education: "혜전대학(현 혜전대학교) 전자상거래과 졸업",
			careers: [
				"(현)(주)삼구아이앤씨 사원",
			],
			constituency: "중구",
			party: "닫힌우리당",
		},
		{
			name: "김금동",
			birth: "1977-10-19",
			gender: "man",
			job: "자영업",
			education: "대한체육과학대학(현 용인대학교) 경영학과 졸업",
			careers: [
				"(현) 경기가설재(주) 대표",
			],
			constituency: "중구",
			party: "각자민주당",
		},
		{
			name: "김영남",
			birth: "1975-01-19",
			gender: "man",
			job: "정당인",
			education: "광운대학교 대학원 환경공학과 졸업(공학박사)",
			careers: [
				"(현)제20대 국회의원",
				"(현)미래통합당 원내대변인",
			],
			constituency: "중구",
			party: "미래분리당",
		},
		{
			name: "박응삼",
			birth: "1965-05-09",
			gender: "man",
			job: "개인사업",
			education: "포항대학교 졸업",
			careers: [
				"(전)문재인대통령후보 경북도당 유세단장",
				"(현)정당인",
			],
			constituency: "해운대구갑",
			party: "닫힌우리당",
		},
		{
			name: "김희옥",
			birth: "1967-03-09",
			gender: "woman",
			job: "국회의원",
			education: "대구전문대학(현 대구과학대학교) 간호과 졸업",
			careers: [
				"(전)포항기독병원 간호사 근무",
			],
			constituency: "해운대구갑",
			party: "각자민주당",
		},
		{
			name: "김주창",
			birth: "1971-02-14",
			gender: "man",
			job: "정당인",
			education: "동국대학교 국사학과 졸업",
			careers: [
				"(전)민주노총 전국플랜트건설노조 포항지부 교육선전부장",
				"(현)민주노총 공공연대노조 경북지부 사무국장",
			],
			constituency: "해운대구갑",
			party: "미래분리당",
		},
		{
			name: "김소담",
			birth: "1982-11-14",
			gender: "woman",
			job: "정당인",
			education: "고려대학교 정책대학원 석사과정 국제관계학과 수료",
			careers: [
				"(전)국무총리실 국무차장",
				"(전)강원연구원 원장"
			],
			constituency: "사하구갑",
			party: "닫힌우리당",
		},
		{
			name: "이명숙",
			birth: "1986-12-14",
			gender: "woman",
			job: "기업인",
			education: "강원대학교 일반대학원 관광경영학과 박사과정 수료",
			careers: [
				"(전)강원도의원",
				"(현)강원대학교 경영대학 관광경영학과 연구원",
			],
			constituency: "사하구갑",
			party: null,
		},
		{
			name: "김보배",
			birth: "1976-03-12",
			gender: "woman",
			job: "국회의원",
			education: "서울대학교 법과대학 공법학과 졸업",
			careers: [
				"(현)제20대 국회의원",
				"(전)제19대 대선 자유한국당 경선후보",
			],
			constituency: "목포시",
			party: "닫힌우리당",
		},
		{
			name: "이노마",
			birth: "1980-04-12",
			gender: "man",
			job: "주식회사 에이치엔써지컬 대표",
			education: "연세대학교 임상병리학과 졸업",
			careers: [
				"(현)주식회사 에이치엔써지컬 대표자",
				"(현)국가혁명배당금당 당대표 특별보좌관",
			],
			constituency: "목포시",
			party: "각자민주당",
		},
		{
			name: "정윤회",
			birth: "1976-09-08",
			gender: "woman",
			job: "회사원",
			education: "한림대학교 화학과 졸업",
			careers: [
				"(현)주식회사 백경 재무부장",
			],
			constituency: "목포시",
			party: "미래분리당",
		},
		{
			name: "이복길",
			birth: "1972-12-31",
			gender: "woman",
			job: "회사원",
			education: "중앙대학교 독어독문학과 졸업",
			careers: [
				"(전)종로학원 영어강사",
				"(현)주식회사 백경 해외영업부장"
			],
			constituency: "목포시",
			party: "개인혁명독점금당",
		},
		{
			name: "고길동",
			birth: "1977-07-17",
			gender: "man",
			job: "정당인",
			education: null,
			careers: [
				"(전)조계종 승려생활 20년",
			],
			constituency: "영암군무안군신안군",
			party: "닫힌우리당",
		},
		{
			name: "강주사",
			birth: "1964-08-30",
			gender: "man",
			job: "취업준비생",
			education: "대구한의대학교 한방스포츠의학과 졸업",
			careers: [
				"(전)동춘천학곡리농협 아르바이트",
			],
			constituency: "영암군무안군신안군",
			party: "각자민주당",
		},
		{
			name: "최병태",
			birth: "1961-11-17",
			gender: "man",
			job: "법률사무소 강원 대표 변호사",
			education: "강원대학교 법학전문대학원 법학과 졸업(법학석사)",
			careers: [
				"(현)자유한국당 법률자문위원",
				"(전)남경필, 강용석 국회의원 정책비서",
			],
			constituency: "영암군무안군신안군",
			party: "개인혁명독점금당",
		},
		{
			name: "안영명",
			birth: "1971-02-17",
			gender: "man",
			job: "경희대학교 교수",
			education: "미국 켄트주립대학교 정치학과 졸업(정치학박사 1988.8 ~ 1995. 5)",
			careers: [
				"(현)자유한국당 황교안당대표 특별보좌역",
				"(현)경희대학교 교수",
			],
			constituency: "청주시갑",
			party: "닫힌우리당",
		},
		{
			name: "이윤덕",
			birth: "1964-10-10",
			gender: "woman",
			job: "강사",
			education: "강릉원주대학교 일반대학원 박사과정 교육학과 제적(2013. 3. 1. ~ 2016. 3. 29)",
			careers: [
				"(현)한국이미지리더십센터 대표",
				"(현)행복을전하는사람들 회장",
			],
			constituency: "청주시갑",
			party: "각자민주당",
		},
		{
			name: "김용림",
			birth: "1960-11-10",
			gender: "woman",
			job: "정당인",
			education: "한양대학교 영어교육과 졸업",
			careers: [
				"(전)강릉시장(2006년7월1일~2018년6월30일)",
			],
			constituency: "청주시갑",
			party: null,
		},
		{
			name: "배복근",
			birth: "1990-07-28",
			gender: "man",
			job: "가톨릭관동대학교 경영행정대학원 경영학과 석좌교수",
			education: "고려대학교 행정학과 졸업",
			careers: [
				"(현)제20대 국회의원",
				"(전)18대, 19대 국회의원",
			],
			constituency: "청주시갑",
			party: "개인혁명독점금당",
		},
		{
			name: "박일",
			birth: "1970-10-28",
			gender: "man",
			job: "변호사",
			education: "서울대학교 법과대학 사법학과 졸업",
			careers: [
				"(전)창원지방검찰청 검사장",
				"(현)법무법인 문평 대표변호사",
			],
			constituency: "제천시단양군",
			party: "닫힌우리당",
		},
		{
			name: "이영범",
			birth: "1972-04-08",
			gender: "man",
			job: "국회의원",
			education: "세경대학 사회복지학과 졸업",
			careers: [
				"(전)민선4기·5기·6기 영월군수",
				"(전)전국시장군수구청장협의회군수대표",
			],
			constituency: "제천시단양군",
			party: "각자민주당",
		},
		{
			name: "전민수",
			birth: "1964-10-11",
			gender: "man",
			job: "농업",
			education: "춘천대학 법률학과 2년 중퇴",
			careers: [],
			constituency: "제천시단양군",
			party: "미래분리당",
		},
		{
			name: "고희동",
			birth: "1983-03-19",
			gender: "man",
			job: "회사원",
			education: "삼척대학교 공학대학 토목공학과 졸업",
			careers: [
				"(전)제14ㆍ17대 국회의원",
				"(전)홍천군철원군화천군양구군인제군지역위원회 위원장",
			],
			constituency: "제천시단양군",
			party: null,
		},
	];
	const candidatesByConstituency = candidates.reduce((acc, cur) => {
		if (!(cur.constituency in acc))
			acc[cur.constituency] = [];
		acc[cur.constituency].push({
			...cur,
			number: acc[cur.constituency].length + 1
		});
		return acc;
	}, {});
	for (let d of Object.keys(candidatesByConstituency)) {
		const constituencyId = (await Constituency.findOne({ where: { name: d }})).id;
		for (let c of candidatesByConstituency[d]) {
			const party = await Party.findOne({ where: { name: c.party } });
			const candidate = await Candidate.create({
				...c,
				partyId: (party) ? party.id : null,
				constituencyId,
			});
		}
	}
}

const setUpPromises = async () => {
	const promises = [
		{ category: ["기술", "생활"], content: "와이파이 무료" },
		{ category: ["경제", "일자리"], content: "최저임금 인상" },
		{ category: ["의료"], content: "백신 개발" },
		{ category: ["환경"], content: "나무심기" },
		{ category: ["경제", "생활"], content: "아나바다 운동" },
		{ category: ["교육"], content: "무상급식" },
		{ category: ["의료"], content: "보건소 추가설치" },
		{ category: ["벤처기업", "경제", "기술"], content: "핀테크 산업 육성" },
		{ category: ["교육", "환경"], content: "쓰레기 줍기 체험활동" },
		{ category: ["환경", "생활", "교통"], content: "자전거 무료 대여" },
		{ category: ["기술", "벤처기업"], content: "개발자 컨퍼런스 개최" },
		{ category: ["균형발전", "경제"], content: "저소득층 대중교통비 할인" },
		{ category: ["치안", "여성"], content: "밤길 지킴이 인원 충원" },
	];
	const candidates = await Candidate.findAll();
	const promiseCountPerCandidate = 3;
	let i = 0;
	for (let candidate of candidates) {
		let promisesPerCandidate = [];
		while (promisesPerCandidate.length < promiseCountPerCandidate) {
			const promise = await ElectionPromise.create({
				...promises[i],
				content: `${candidate.name}는(은) ${promises[i].content} 하겠습니다`,
			});
			promisesPerCandidate.push(promise);
			i = (i + 1) % promises.length;
		}
		await candidate.setPromises(promisesPerCandidate);
	}
}

const setUpGeneralInfo = async () => {
	await GeneralInfo.create({ voterCount: 32700000 });
}

const setUpWords = async () => {
	try {
		const gab = await Constituency.findByNameCity({
			name: "서구갑",
			city: "대전",
		});
		const eul = await Constituency.findByNameCity({
			name: "서구을",
			city: "대전",
		});
		const constituencyIds = (await Constituency.findAll()).map(d => d.id);
		const getRandomId = () => {
			return parseInt(Math.random() * constituencyIds.length) + 1;
		}
		const words = [
			{ text: "대전 서구갑", type: "선거구", constituencyId: gab.id },
			{ text: "대전 서구을", type: "선거구", constituencyId: eul.id },
			{ text: "서강준", type: "후보", constituencyId: getRandomId() },
			{ text: "서경석", type: "후보", constituencyId: getRandomId() },
			{ text: "서신애", type: "후보", constituencyId: getRandomId() },
			{ text: "이서준", type: "후보", constituencyId: getRandomId() },
			{ text: "김서영", type: "후보", constituencyId: getRandomId() },
			{ text: "서서갈비", type: "후보", constituencyId: getRandomId() },
			{ text: "이민서", type: "후보", constituencyId: getRandomId() },
			{ text: "박민서", type: "후보", constituencyId: getRandomId() },
			{ text: "김영서", type: "후보", constituencyId: getRandomId() },
			{ text: "서민석", type: "후보", constituencyId: getRandomId() },
			{ text: "대조영", type: "후보", constituencyId: getRandomId() },
			{ text: "왕건", type: "후보", constituencyId: getRandomId() },
			{ text: "이순신", type: "후보", constituencyId: getRandomId() },
		];
		await Word.bulkCreate(words);
	} catch (err) {
		throw err;
	}
}

beforeAll(async () => {
	try {
		await sequelize.sync({ force: true });
		await setUpParty();
		await setUpCityDistrict();
		await setUpCandidates();
		await setUpPromises();
		await setUpGeneralInfo();
		await setUpWords();
	} catch (err) {
		console.error("global before all", err);
	}
});

afterAll(async () => {
	try {
		await sequelize.close();
	} catch (err) {
		throw err;
	}
})