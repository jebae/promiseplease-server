export default function MockReq({ method, params, query }) {
	this.method = method;
	this.params = params || {};
	this.query = query || {};
}