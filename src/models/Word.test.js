import models from ".";
import { TestScheduler } from "jest";

const { Word, District } = models;

describe("models.Word", () => {
	describe("search", () => {
		const attrs = [ "word", "city", "constituency", "type" ];
		const wordsAttrsTest = (words, text) => {
			words.forEach(word => {
				attrs.forEach(attr => {
					expect(attr in word).toEqual(true);
				});
				expect(word.word.search(text)).not.toEqual(-1);
				expect(typeof word.city).toEqual("string");
				expect(typeof word.constituency).toEqual("string");
				expect(typeof word.type).toEqual("string");
			});
		}

		test("first page", async () => {
			try {
				const text = "서";
				const [ words, next ] = await Word.search({ text, next: 0 });

				expect(next).toEqual(1);
				expect(words).toHaveLength(10);
				wordsAttrsTest(words, text);
			} catch (err) {
				throw err;
			}
		});

		test("next page", async () => {
			try {
				const text = "서";
				const [ words, next ] = await Word.search({ text, next: 1 });

				expect(next).toEqual(null);
				expect(words.length).toBeGreaterThan(0);
				expect(words.length).toBeLessThan(10);
				wordsAttrsTest(words, text);
			} catch (err) {
				throw err;
			}
		});

		test("text == ''", async () => {
			try {
				const text = "";
				const [ words, next ] = await Word.search({ text, next: 0 });

				expect(next).toEqual(null);
				expect(words).toHaveLength(0);
			} catch (err) {
				throw err;
			}
		});

		test("text == ' \t'", async () => {
			try {
				const text = " \t";
				const [ words, next ] = await Word.search({ text, next: 0 });

				expect(next).toEqual(null);
				expect(words).toHaveLength(0);
			} catch (err) {
				throw err;
			}
		});

		test("typeof next != number", async () => {
			try {
				const text = "서";
				const [ words, next ] = await Word.search({ text, next: "1" });

				expect(next).toEqual(null);
				expect(words).toHaveLength(0);
			} catch (err) {
				throw err;
			}
		});

		test("not exist", async () => {
			try {
				const text = "notexist";
				const [ words, next ] = await Word.search({ text, next: 1 });

				expect(next).toEqual(null);
				expect(words).toHaveLength(0);
			} catch (err) {
				throw err;
			}
		});
	});
});