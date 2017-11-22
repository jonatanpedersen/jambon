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

exports.default = function (db) {
	const foos = db.collection('foos');

	return [(0, _jambonRouter.path)('/api/foos', (0, _jambonRouter.post)(createFoo), (0, _jambonRouter.get)(getFoos)), (0, _jambonRouter.path)('/api/foos/:id', (0, _jambonRouter.get)(findFoo))];

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
};

var _jambonRouter = require('jambon-router');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }