'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _asyncGenerator2 = require('babel-runtime/helpers/asyncGenerator');

var _asyncGenerator3 = _interopRequireDefault(_asyncGenerator2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

let iterableCursor = (() => {
	var _ref = _asyncGenerator3.default.wrap(function* (cursor) {
		try {
			while (yield _asyncGenerator3.default.await(cursor.hasNext())) {
				yield yield _asyncGenerator3.default.await(cursor.next());
			}
		} finally {
			yield _asyncGenerator3.default.await(cursor.close());
		}
	});

	return function iterableCursor(_x) {
		return _ref.apply(this, arguments);
	};
})();

exports.main = main;

var _mongodb = require('mongodb');

var _jambonCore = require('jambon-core');

var _jambonRouter = require('jambon-router');

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function main() {
	const db = await _mongodb.MongoClient.connect('mongodb://localhost/jambon');
	const foos = db.collection('foos');
	const bars = [{
		id: '1',
		title: 'Bar 1'
	}];

	const requestListener = (0, _jambonCore.jambon)(_jambonCore.lowerCaseRequestHeaders, _jambonCore.parseRequestQuery, (0, _jambonRouter.post)(_jambonCore.parseRequestBody), (0, _jambonRouter.path)('/foos', (0, _jambonRouter.post)(createFoo), (0, _jambonRouter.get)(getFoos)), (0, _jambonRouter.path)('/foos/:id', (0, _jambonRouter.get)(findFoo)), (0, _jambonRouter.path)('/bars', (0, _jambonRouter.get)(getBars)), (0, _jambonRouter.path)('/bars/:id', (0, _jambonRouter.get)(findBar)), _jambonCore.jsonResponse);

	const server = _http2.default.createServer(requestListener);
	server.listen(8000);

	async function createFoo({ request, response }) {
		const foo = request.body;
		await foos.insertOne(foo);

		const body = foo;
		const statusCode = 201;
		const statusMessage = 'Created Foo';

		return {
			request,
			response: (0, _extends3.default)({}, response, {
				body,
				statusCode,
				statusMessage
			})
		};
	}

	async function getFoos({ request, response }) {
		const body = iterableCursor(foos.find());
		const statusCode = 200;

		return {
			request,
			response: (0, _extends3.default)({}, response, {
				body,
				statusCode
			})
		};
	}

	async function findFoo({ request, response }) {
		const { id } = request.params;
		const foo = await foos.findOne({ id });

		const body = foo;
		const statusCode = foo ? 200 : 404;

		return {
			request,
			response: (0, _extends3.default)({}, response, {
				body,
				statusCode
			})
		};
	}

	async function getBars({ request, response }) {
		const body = bars;
		const statusCode = 200;

		return {
			request,
			response: (0, _extends3.default)({}, response, {
				body,
				statusCode
			})
		};
	}

	async function findBar({ request, response }) {
		const id = request.params.id;
		const bar = bars.find(bar => bar.id === id);
		const body = bar;
		const statusCode = bar ? 200 : 404;

		return {
			request,
			response: (0, _extends3.default)({}, response, {
				body,
				statusCode
			})
		};
	}
}