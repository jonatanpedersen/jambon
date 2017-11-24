import {MongoClient} from 'mongodb';
import {createRequestListener, lowerCaseRequestHeaders, parseRequestBody, parseRequestQuery, jsonResponse, notFound, HttpMethods} from 'jambon-core';
import {path, get, post} from 'jambon-router';
import {createServer} from 'http';
import api from './api';

export async function main () {
	const db = await MongoClient.connect('mongodb://localhost/jambon');

	const reducers = [
		lowerCaseRequestHeaders,
		parseRequestQuery,
		api({db}),
		notFound
	];

	const port = process.env.PORT || 8000;
	const requestListener = createRequestListener(...reducers);
	const server = createServer(requestListener);

	server.listen(port);
}
