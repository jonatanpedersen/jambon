'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.main = main;

var _mongodb = require('mongodb');

var _jambonCore = require('jambon-core');

var _jambonRouter = require('jambon-router');

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _foos = require('./foos');

var _foos2 = _interopRequireDefault(_foos);

var _bars = require('./bars');

var _bars2 = _interopRequireDefault(_bars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function main() {
	const db = await _mongodb.MongoClient.connect('mongodb://localhost/jambon');

	const requestListener = (0, _jambonCore.jambon)(_jambonCore.lowerCaseRequestHeaders, _jambonCore.parseRequestQuery, (0, _jambonRouter.path)('/api', (0, _jambonRouter.post)(_jambonCore.parseRequestBody), ...(0, _foos2.default)(db), ...(0, _bars2.default)(), _jambonCore.jsonResponse));

	const server = _http2.default.createServer(requestListener);
	server.listen(8000);
}