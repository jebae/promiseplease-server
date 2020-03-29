export default function MockRes({ jsonArg }) {
	this.json = jest.fn().mockImplementation(obj => {
		if (!jsonArg)
			return ;
		Object.keys(obj).map(key => {
			jsonArg[key] = obj[key];
		});
	});
	this.status = jest.fn().mockImplementation(() => this);
	this.send = jest.fn();
}