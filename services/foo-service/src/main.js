import {MongoClient, Cursor} from 'mongodb';
import {jambon, lowerCaseRequestHeaders, parseRequestBody, parseRequestQuery, jsonResponse} from 'jambon-core';
import {path, get, post} from 'jambon-router';
import http from 'http';
import foos from './foos';
import bars from './bars';

export async function main () {
	const db = await MongoClient.connect('mongodb://localhost/jambon');

	const requestListener = jambon(
		lowerCaseRequestHeaders,
		parseRequestQuery,
		path('/api',
			post(parseRequestBody),
			...foos(db),
			...bars(),
			jsonResponse
		)
	);

	const server = http.createServer(requestListener);
	server.listen(8000);
}
