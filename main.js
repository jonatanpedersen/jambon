const express = require('express');
const bodyParser = require('body-parser');
const util = require('util');
const {MongoClient, Cursor} = require('mongodb');

module.exports = {main};

async function main () {
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
			for (header in response.headers) {
				res.setHeader(header, response.headers[header]);
			}
		}

		if (response.statusCode) {
			res.status(response.statusCode);
		}

		if (true || isAsyncIterable(response.body)) {
			let first = true;
			res.write('[');

			await forEach(response.body, item => {
				if (first) {
					first = false;
				} else {
					res.write(',');
				}

				res.write(JSON.stringify(item));
			});

			res.write(']');
			res.end();
		} else {
			res.json(response.body);
		}
	}

	return util.callbackify(handle);
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

		for (reducer of reducers) {
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
			await sleep(200);
			yield await cursor.next();
		}
	} finally {
		await cursor.close();
	}
}

async function forEach(ai, fn) {
	return ai.next().then(({value, done}) => {
		if (!done) {
			fn(value);

			return forEach(ai, fn);
		}
	});
}

async function sleep (timeout) {
	return new Promise (resolve => {
		setTimeout(resolve, timeout);
	});
}