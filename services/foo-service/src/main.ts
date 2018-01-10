import {MongoClient} from 'mongodb';
import {all, createRequestListener, lazy, parseRequestQuery, HttpMethods} from 'jambon';
import {path, get, post} from 'jambon-router';
import {createServer} from 'http';
import api from './api';

export async function main () {
	const db = await MongoClient.connect('mongodb://localhost/jambon');

	const reducer = lazy(() =>
		katch(
			all(
				parseRequestQuery,
				api({db})
			)
		)
	);

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
					statusCode: 500
				}
			}
		}
	}
}
