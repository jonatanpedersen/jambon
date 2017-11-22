'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

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

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _mongodb = require('mongodb');

var _jambonCore = require('jambon-core');

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function main() {
	const app = (0, _express2.default)();
	app.use(_bodyParser2.default.json());
	const db = await _mongodb.MongoClient.connect('mongodb://localhost/jambon');
	const foos = db.collection('foos');
	const bars = [{
		id: '1',
		title: 'Bar 1'
	}];

	const server = _http2.default.createServer((0, _jambonCore.jambon)((0, _jambonCore.compositeReducer)(getFoos, _jambonCore.jsonResponse)));

	server.listen(8000);

	app.post('/foos', (0, _jambonCore.bridge)((0, _jambonCore.compositeReducer)(createFoo, _jambonCore.jsonResponse)));

	app.get('/foos', (0, _jambonCore.bridge)((0, _jambonCore.compositeReducer)(getFoos, _jambonCore.jsonResponse)));

	app.get('/foos/:id', (0, _jambonCore.bridge)((0, _jambonCore.compositeReducer)(findFoo, _jambonCore.jsonResponse)));

	app.get('/bars', (0, _jambonCore.bridge)((0, _jambonCore.compositeReducer)(getBars, _jambonCore.jsonResponse)));

	app.get('/bars/:id', (0, _jambonCore.bridge)((0, _jambonCore.compositeReducer)(findBar, _jambonCore.jsonResponse)));

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

	app.listen(1939);
}

async function sleep(timeout) {
	return new _promise2.default(resolve => {
		setTimeout(resolve, timeout);
	});
}