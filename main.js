import express from 'express';
import bodyParser from 'body-parser';
import util from 'util';
import {MongoClient, Cursor} from 'mongodb';

export async function main () {
	const app = express();
	app.use(bodyParser.json());
	const db = await MongoClient.connect('mongodb://localhost/jambon');
	const foos = db.collection('foos');

	app.post('/foos', bridge(compositeReducer([
		createFoo,
		setResponseContentTypeHeader,
		setResponseStatusCode
	])));

	app.get('/foos', bridge(compositeReducer([
		getFoos,
		setResponseContentTypeHeader,
		setResponseStatusCode
	])));

	app.get('/foos/:id', bridge(compositeReducer([
		findFoo,
		setResponseContentTypeHeader,
		setResponseStatusCode
	])));

	async function createFoo (request, response) {
		const foo = request.body;

		await foos.insertOne(foo);

		return {request, response: {...response, body: foo}};
	}

	async function getFoos (request, response) {
		return {request, response: {...response, body: iterableCursor(foos.find({}))}};
	}

	async function findFoo (request, response) {
		const {id} = request.params;
		const foo = foos.find({id});

		return {request, response: {...response, body: foo}};
	}

	app.listen(1939);
}

function bridge (reducer) {
	async function handle (req, res) {
		const {body, headers, params, query} = req;
		const {request, response} = await reducer({body, headers, params, query}, {});

		if (response.headers) {
			for (let header in response.headers) {
				res.setHeader(header, response.headers[header]);
			}
		}

		if (response.statusCode) {
			res.status(response.statusCode);
		}

		if (true || isAsyncIterable(response.body)) {
			const jsonBody = json(response.body);

			await forEach(jsonBody, str => {
				res.write(str);
			});

			res.end();
		} else {
			res.json(response.body);
		}
	}

	return util.callbackify(handle);
}

async function* json (asyncIterator) {
	let first = true;
	yield '[';

	for await (const item of asyncIterator) {
		if (first) {
			first = false;
		} else {
			yield ',';
		}

		yield JSON.stringify(item);
	}

	yield ']';
}

async function setResponseContentTypeHeader (request, response) {
	return {request, response: {...response, headers: {...response.headers, 'Content-Type': 'application/json'}}};
}

async function setResponseStatusCode (request, response) {
	return {request, response: {...response, statusCode: 200}};
}

function compositeReducer (reducers) {
	return async function (request, response) {
		let memo = {request, response};

		for (let reducer of reducers) {
			memo = await reducer(memo.request, memo.response);
		}

		return memo;
	}
}

function isAsyncIterable(obj) {
	// checks for null and undefined
	if (obj == null) {
		return false;
	}

	return typeof obj[Symbol.asyncIterator] === 'function';
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

async function forEach(ai, fn) {
	return ai.next().then(r => {
		if (!r.done) {
			fn(r.value);

			return forEach(ai, fn);
		}
	});
}

async function sleep (timeout) {
	return new Promise (resolve => {
		setTimeout(resolve, timeout);
	});
}