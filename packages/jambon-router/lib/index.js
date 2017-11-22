'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.put = exports.post = exports.patch = exports.get = exports.del = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.path = path;
exports.method = method;

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _pathToRegexp = require('path-to-regexp');

var _pathToRegexp2 = _interopRequireDefault(_pathToRegexp);

var _jambonCore = require('jambon-core');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function path(path, ...reducers) {
	const keys = [];
	const regexp = (0, _pathToRegexp2.default)(path, keys);

	return async function (state) {
		const { pathname } = _url2.default.parse(state.request.url);
		const match = regexp.exec(pathname);

		if (match) {
			match.shift();

			const params = keys.reduce((params, key) => {
				params[key.name] = match.shift();
				return params;
			}, {});

			state = (0, _extends3.default)({}, state, { request: (0, _extends3.default)({}, state.request, { params }) });

			return (0, _jambonCore.all)(...reducers)(state);
		}

		return state;
	};
}

function method(method, ...reducers) {
	return async function (state) {
		const requestMethod = state.request.method;

		if (requestMethod !== method) {
			return state;
		}

		return (0, _jambonCore.all)(...reducers)(state);
	};
}

const del = exports.del = method.bind(null, 'DELETE');
const get = exports.get = method.bind(null, 'GET');
const patch = exports.patch = method.bind(null, 'PATCH');
const post = exports.post = method.bind(null, 'POST');
const put = exports.put = method.bind(null, 'PUT');