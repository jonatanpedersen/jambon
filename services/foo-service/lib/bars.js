'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.default = function () {
	const bars = [{
		id: '1',
		title: 'Bar 1'
	}];

	return [(0, _jambonRouter.path)('/api/bars', (0, _jambonRouter.get)(getBars)), (0, _jambonRouter.path)('/api/bars/:id', (0, _jambonRouter.get)(findBar))];

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
};

var _jambonRouter = require('jambon-router');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }