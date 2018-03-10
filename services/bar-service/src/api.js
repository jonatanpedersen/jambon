const { bars } = require('./bars');
const { path } = require( '@jambon/router');
const { jsonStringifyResponseBody, setResponseContentTypeHeaderToApplicationJson } = require('@jambon/json');

module.exports = { api };

function api() {
	return path('/api',
		...bars(),
		setResponseContentTypeHeaderToApplicationJson,
		jsonStringifyResponseBody
	);
}