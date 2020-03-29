module.exports = {
	testRegex: "./src/.*\\.test\\.js$",
	setupFiles: [
		"./.test_utils/jest.setup.js"
	],
	setupFilesAfterEnv: [
		"./.test_utils/jest.setupAfterEnv.js"
	]
}