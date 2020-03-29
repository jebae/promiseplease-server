import models from ".";

const { VoteLocation, District, Constituency } = models;

describe("models.VoteLocation", () => {
	describe("findByDistrict", () => {
		test("exist", async () => {
			try {
				const name = "청주시상당구";
				const city = "충북";
				const attrs = [ "address", "latitude", "longitude", "type" ];
				const district = await District.findOne({ where: { name } });
				const voteLocations = await VoteLocation.findByDistrict(district.id);

				expect(voteLocations).not.toHaveLength(0);
				voteLocations.forEach(item => {
					expect(typeof item).toEqual("object");
					attrs.forEach(attr => {
						expect(attr in item).toEqual(true);
					});
					expect(typeof item.address).toEqual("string");
					expect(typeof item.type).toEqual("string");
					expect(typeof item.latitude).toEqual("number");
					expect(typeof item.longitude).toEqual("number");
				});
			} catch (err) {
				throw err;
			}
		});

		test("not exist", async () => {
			try {
				const voteLocations = await VoteLocation.findByDistrict(0);

				expect(voteLocations).toHaveLength(0);
			} catch (err) {
				throw err;
			}
		});
	});

	describe("findByConstituency", () => {
		test("1 district", async () => {
			try {
				const name = "마포구갑";
				const city = "서울";
				const districtAttrs = [ "name", "locations" ];
				const locAttrs = [ "address", "latitude", "longitude", "type" ];
				const constituency = await Constituency.findOne({ where: { name } });
				const districts = await VoteLocation.findByConstituency(constituency.id);

				expect(districts).toHaveLength(1);
				const district = districts[0];
				districtAttrs.forEach(attr => {
					expect(attr in district).toEqual(true);
				});
				expect(typeof district.name).toEqual("string");
				expect(typeof district.locations).toEqual("object");
				district.locations.forEach(loc => {
					locAttrs.forEach(attr => {
						expect(attr in loc).toEqual(true);
					});
					expect(typeof loc.address).toEqual("string");
					expect(typeof loc.type).toEqual("string");
					expect(typeof loc.latitude).toEqual("number");
					expect(typeof loc.longitude).toEqual("number");
				});
			} catch (err) {
				throw err;
			}
		});

		test("multi district", async () => {
			try {
				const name = "영암군무안군신안군";
				const city = "전남";
				const districtAttrs = [ "name", "locations" ];
				const locAttrs = [ "address", "latitude", "longitude", "type" ];
				const constituency = await Constituency.findOne({ where: { name } });
				const districts = await VoteLocation.findByConstituency(constituency.id);

				expect(districts).not.toHaveLength(0);
				districts.forEach(district => {
					districtAttrs.forEach(attr => {
						expect(attr in district).toEqual(true);
					});
					expect(typeof district.name).toEqual("string");
					expect(typeof district.locations).toEqual("object");
					district.locations.forEach(loc => {
						locAttrs.forEach(attr => {
							expect(attr in loc).toEqual(true);
						});
						expect(typeof loc.address).toEqual("string");
						expect(typeof loc.type).toEqual("string");
						expect(typeof loc.latitude).toEqual("number");
						expect(typeof loc.longitude).toEqual("number");
					});
				});
			} catch (err) {
				throw err;
			}
		});

		test("no district", async () => {
			try {
				const districts = await VoteLocation.findByConstituency(0);

				expect(districts).toHaveLength(0);
			} catch (err) {
				throw err;
			}
		});
	});
});