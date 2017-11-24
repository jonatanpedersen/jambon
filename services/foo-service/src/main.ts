import {MongoClient} from 'mongodb';
import {createRequestListener, lowerCaseRequestHeaders, parseRequestBody, parseRequestQuery, jsonResponse, notFound} from 'jambon-core';
import {path, get, post} from 'jambon-router';
import {createServer} from 'http';
import foos from './foos';
import bars from './bars';

export async function main () {
	const db = await MongoClient.connect('mongodb://localhost/jambon');

	const reducers = [
		lowerCaseRequestHeaders,
		parseRequestQuery,
		path('/api',
			parseRequestBody,
			post(parseRequestBody),
			...foos(db),
			...bars(),
			jsonResponse
		),
		notFound
	];

	const port = process.env.PORT || 8000;
	const requestListener = createRequestListener(...reducers);
	const server = createServer(requestListener);

	server.listen(port);
}
