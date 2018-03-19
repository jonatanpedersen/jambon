const { all, createRequestListener, lazy, parseRequestQuery } = require('@jambon/core');
const { host } = require('@jambon/router');
const { createServer } = require('http');
const { api } = require('./api');

module.exports = { main };

async function main() {
	const reducer = lazy(() =>
		all(
			context => {
				console.log(context);
				return context;
			},
			parseRequestQuery,
			api()
		)
	);

	const port = process.env.PORT || 8101;
	const requestListener = createRequestListener(reducer);
	const server = createServer(requestListener);

	server.listen(port);
}
