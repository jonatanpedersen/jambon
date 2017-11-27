# jambon
Minimalistic functional http server

[![Build Status](https://travis-ci.org/jonatanpedersen/jambon.svg?branch=master)](https://travis-ci.org/jonatanpedersen/jambon)

[![NSP Status](https://nodesecurity.io/orgs/jonatanpedersen/projects/66fa69df-c041-499b-9867-5dec8475fc8d/badge)](https://nodesecurity.io/orgs/jonatanpedersen/projects/66fa69df-c041-499b-9867-5dec8475fc8d)

## Hello World

``` javascript
import {jambon} from 'jambon-core';
import http from 'http';

const server = http.createServer(
	jambon(helloWorld)
);

const port = process.env.PORT || 8000;

server.listen(port);

function helloWorld ({request, response}) {
	return {
		...request,
		response: {
			...response,
			headers: {
				...response.headers,
				'Content-Type': 'text/html'
			}
			body: 'Hello World',
			statusCode: 200
		}
	};
}
```

## Routing

``` javascript
import {jambon} from 'jambon-core';
import {path, get} from 'jambon-router';
import http from 'http';

const server = http.createServer(
	jambon(
		path('/hello/:subject',
			get(
				helloSubject
			)
		)
	)
);

const port = process.env.PORT || 8000;

server.listen(port);

function helloSubject ({request, response}) {
	return {
		...request,
		response: {
			...response,
			headers: {
				...response.headers,
				'Content-Type': 'text/html'
			}
			body: `Hello ${request.params.subject}`,
			statusCode: 200
		}
	};
}
```

## JSON API example
``` javascript
import {jambon, lowerCaseRequestHeaders, parseRequestBody, parseRequestQuery, jsonResponse} from 'jambon-core';
import {path, get, post} from 'jambon-router';
import http from 'http';

const bars = [{
	id: '1',
	title: 'Bar 1'
}, {
	id: '2',
	title: 'Bar 2'
}];

const requestListener = jambon(
	lowerCaseRequestHeaders,
	parseRequestQuery,
	path('/api',
		post(parseRequestBody),
		path('/api/bars',
			get(getBars)
		),
		path('/api/bars/:id',
			get(findBar)
		),
		jsonResponse
	)
);

const port = process.env.PORT || 8000;
const server = http.createServer(requestListener);
server.listen(port);

async function getBars ({request, response}) {
	return {
		request,
		response: {
			...response,
			body: bars,
			statusCode: 200
		}
	};
}

async function findBar ({request, response}) {
	const {id} = request.params;
	const bar = bars.find(bar => bar.id === id);

	return {
		request,
		response: {
			...response,
			body: bar,
			statusCode: bar ? 200 : 404
		}
	};
}
```
