import {MongoClient} from 'mongodb';
import {all, createRequestListener, lazy, parseRequestQuery} from '@jambon/core';
import {path, get, post} from '@jambon/router';
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
	return async function katch (context) {
		try {
			return await reducer(context);
		} catch (err) {
			return {
				...context,
				response: {
					...context.response,
					statusCode: 500
				}
			}
		}
	}
}
