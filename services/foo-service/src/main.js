import {MongoClient, Cursor} from 'mongodb';
import {jambon, lowerCaseRequestHeaders, parseRequestBody, parseRequestQuery, jsonResponse} from 'jambon-core';
import {path, get, post} from 'jambon-router';
import http from 'http';

export async function main () {
	const db = await MongoClient.connect('mongodb://localhost/jambon');
	const foos = db.collection('foos');
	const bars = [{
		id: '1',
		title: 'Bar 1'
	}];

	const requestListener = jambon(
		lowerCaseRequestHeaders,
		parseRequestQuery,
		post(parseRequestBody),
		path('/foos',
			post(createFoo),
			get(getFoos)
		),
		path('/foos/:id',
			get(findFoo)
		),
		path('/bars',
			get(getBars)
		),
		path('/bars/:id',
			get(findBar)
		),
		jsonResponse
	);

	const server = http.createServer(requestListener);
	server.listen(8000);

	async function createFoo ({request, response}) {
		const foo = request.body;
		await foos.insertOne(foo);

		const body = foo;
		const statusCode = 201;
		const statusMessage = 'Created Foo';

		return {
			request,
			response: {
				...response,
				body,
				statusCode,
				statusMessage
			}
		};
	}

	async function getFoos ({request, response}) {
		const body = iterableCursor(foos.find());
		const statusCode = 200;

		return {
			request,
			response: {
				...response,
				body,
				statusCode
			}
		};
	}

	async function findFoo ({request, response}) {
		const {id} = request.params;
		const foo = await foos.findOne({id});

		const body = foo;
		const statusCode = foo ? 200 : 404;

		return {
			request,
			response: {
				...response,
				body,
				statusCode
			}
		};
	}

	async function getBars ({request, response}) {
		const body = bars;
		const statusCode = 200;

		return {
			request,
			response: {
				...response,
				body,
				statusCode
			}
		};
	}

	async function findBar ({request, response}) {
		const id = request.params.id;
		const bar = bars.find(bar => bar.id === id);
		const body = bar;
		const statusCode = bar ? 200 : 404;

		return {
			request,
			response: {
				...response,
				body,
				statusCode
			}
		};
	}
}

async function* iterableCursor(cursor) {
	try {
		while (await cursor.hasNext()) {
			yield await cursor.next();
		}
	} finally {
		await cursor.close();
	}
}
