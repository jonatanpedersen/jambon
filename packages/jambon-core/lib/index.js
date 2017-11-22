'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.iterableCursor = exports.json = undefined;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _iterator2 = require('babel-runtime/core-js/symbol/iterator');

var _iterator3 = _interopRequireDefault(_iterator2);

var _symbol = require('babel-runtime/core-js/symbol');

var _symbol2 = _interopRequireDefault(_symbol);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _asyncIterator2 = require('babel-runtime/helpers/asyncIterator');

var _asyncIterator3 = _interopRequireDefault(_asyncIterator2);

var _asyncGenerator2 = require('babel-runtime/helpers/asyncGenerator');

var _asyncGenerator3 = _interopRequireDefault(_asyncGenerator2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

let json = exports.json = (() => {
	var _ref = _asyncGenerator3.default.wrap(function* (obj) {
		if (isAsyncIterable(obj)) {
			let first = true;
			yield '[';

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = (0, _asyncIterator3.default)(obj), _step, _value; _step = yield _asyncGenerator3.default.await(_iterator.next()), _iteratorNormalCompletion = _step.done, _value = yield _asyncGenerator3.default.await(_step.value), !_iteratorNormalCompletion; _iteratorNormalCompletion = true) {
					const item = _value;

					if (first) {
						first = false;
					} else {
						yield ',';
					}

					yield (0, _stringify2.default)(item);
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						yield _asyncGenerator3.default.await(_iterator.return());
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			yield ']';
		} else if (isIterable(obj)) {
			let first = true;
			yield '[';

			for (const item of obj) {
				if (first) {
					first = false;
				} else {
					yield ',';
				}

				yield (0, _stringify2.default)(item || null);
			}

			yield ']';
		} else if (isPromise(obj)) {
			const item = yield _asyncGenerator3.default.await(obj);

			if (item) {
				yield (0, _stringify2.default)(item);
			}
		} else {
			const item = obj;

			if (item) {
				yield (0, _stringify2.default)(item);
			}
		}
	});

	return function json(_x) {
		return _ref.apply(this, arguments);
	};
})();

let iterableCursor = exports.iterableCursor = (() => {
	var _ref2 = _asyncGenerator3.default.wrap(function* (cursor) {
		try {
			cursor[_symbol2.default.asyncIterator] = function () {};

			while (yield _asyncGenerator3.default.await(cursor.hasNext())) {
				yield yield _asyncGenerator3.default.await(cursor.next());
			}
		} finally {
			yield _asyncGenerator3.default.await(cursor.close());
		}
	});

	return function iterableCursor(_x2) {
		return _ref2.apply(this, arguments);
	};
})();

exports.jambon = jambon;
exports.bridge = bridge;
exports.jsonResponse = jsonResponse;
exports.compositeReducer = compositeReducer;
exports.isAsyncIterable = isAsyncIterable;
exports.isIterable = isIterable;
exports.isPromise = isPromise;
exports.forEach = forEach;

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function jambon(reducer) {
	async function handle(req, res) {
		const { body, headers, params, query } = req;
		const { request, response } = await reducer({
			request: {
				body,
				headers,
				params,
				query
			},
			response: {}
		});

		if (response.headers) {
			for (let header in response.headers) {
				res.setHeader(header, response.headers[header]);
			}
		}

		if (response.statusMessage) {
			res.statusMessage = response.statusMessage;
		}

		if (response.statusCode) {
			res.statusCode = response.statusCode;
		}

		await forEach(response.body, str => {
			res.write(str);
		});

		res.end();
	}

	return handle;
}

function bridge(reducer) {
	async function handle(req, res) {
		const { body, headers, params, query } = req;
		const { request, response } = await reducer({
			request: {
				body,
				headers,
				params,
				query
			},
			response: {}
		});

		if (response.headers) {
			for (let header in response.headers) {
				res.setHeader(header, response.headers[header]);
			}
		}

		if (response.statusMessage) {
			res.statusMessage = response.statusMessage;
		}

		if (response.statusCode) {
			res.status(response.statusCode);
		}

		await forEach(response.body, str => {
			res.write(str);
		});

		res.end();
	}

	return _util2.default.callbackify(handle);
}

async function jsonResponse({ request, response }) {
	return {
		request,
		response: (0, _extends3.default)({}, response, {
			body: json(response.body),
			headers: (0, _extends3.default)({}, response.headers, { 'Content-Type': 'application/json' })
		})
	};
}

function compositeReducer(...reducers) {
	return async function (state) {
		for (let reducer of reducers) {
			state = await reducer(state);
		}

		return state;
	};
}

function isAsyncIterable(obj) {
	// checks for null and undefined
	if (obj == null) {
		return false;
	}

	return typeof obj[_symbol2.default.asyncIterator] === 'function';
}

function isIterable(obj) {
	// checks for null and undefined
	if (obj == null) {
		return false;
	}

	return typeof obj[_iterator3.default] === 'function';
}

function isPromise(obj) {
	// checks for null and undefined
	if (obj == null) {
		return false;
	}

	return _promise2.default.resolve(obj) == obj;
}

async function forEach(ai, fn) {
	return ai.next().then(r => {
		if (!r.done) {
			fn(r.value);

			return forEach(ai, fn);
		}
	});
}