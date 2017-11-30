import {MongoClient} from 'mongodb';
import {all, createRequestListener, log, text, lazy, lowerCaseRequestHeaders, parseRequestQuery, notFound, HttpMethods} from 'jambon-core';
import {path, get, post} from 'jambon-router';
import {createServer} from 'http';
import api from './api';

export async function main () {
	const db = await MongoClient.connect('mongodb://localhost/jambon');

	const reducer = lazy(() => [
		katch(
			all(
				lowerCaseRequestHeaders,
				parseRequestQuery,
				api({db}),
				notFound,
				log
			)
		)
	]);

	const port = process.env.PORT || 8000;
	const requestListener = createRequestListener(reducer);
	const server = createServer(requestListener);

	server.listen(port);
}

function katch (reducer) {
	return async function katch (state) {
		try {
			return await reducer(state);
		} catch (err) {
			return {
				...state,
				response: {
					...state.response,
					statusCode: 500,
					body: text(err.message)
				}
			}
		}
	}
}
