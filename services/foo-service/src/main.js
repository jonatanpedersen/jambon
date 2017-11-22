import express from 'express';
import bodyParser from 'body-parser';
import util from 'util';
import {MongoClient, Cursor} from 'mongodb';
import {jambon, bridge, compositeReducer, jsonResponse} from 'jambon-core';
import http from 'http';

export async function main () {
	const app = express();
	app.use(bodyParser.json());
	const db = await MongoClient.connect('mongodb://localhost/jambon');
	const foos = db.collection('foos');
	const bars = [{
		id: '1',
		title: 'Bar 1'
	}];

	const server = http.createServer(jambon(compositeReducer(
		getFoos,
		jsonResponse
	)));

	server.listen(8000);

	app.post('/foos', bridge(compositeReducer(
		createFoo,
		jsonResponse
	)));

	app.get('/foos', bridge(compositeReducer(
		getFoos,
		jsonResponse
	)));

	app.get('/foos/:id', bridge(compositeReducer(
		findFoo,
		jsonResponse
	)));

	app.get('/bars', bridge(compositeReducer(
		getBars,
		jsonResponse
	)));

	app.get('/bars/:id', bridge(compositeReducer(
		findBar,
		jsonResponse
	)));

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

	app.listen(1939);
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

async function sleep (timeout) {
	return new Promise (resolve => {
		setTimeout(resolve, timeout);
	});
}