const { all, createRequestListener, lazy, lowerCaseRequestHeaders, parseRequestQuery } = require('jambon-core');
const { path, get, post } = require('jambon-router');
const { createServer } = require('http');
const { api } = require('./api');

module.exports = { main };

async function main() {
	const reducer = lazy(() =>
		all(
			lowerCaseRequestHeaders,
			parseRequestQuery,
			api()
		)
	);

	const port = process.env.PORT || 8101;
	const requestListener = createRequestListener(reducer);
	const server = createServer(requestListener);

	server.listen(port);
}
