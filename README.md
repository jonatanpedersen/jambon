# jambon
Http listener composed with higher order functions returning immutable request/response context reducers.

[![Build Status](https://travis-ci.org/jonatanpedersen/jambon.svg?branch=master)](https://travis-ci.org/jonatanpedersen/jambon)
[![NSP Status](https://nodesecurity.io/orgs/jonatanpedersen/projects/66fa69df-c041-499b-9867-5dec8475fc8d/badge)](https://nodesecurity.io/orgs/jonatanpedersen/projects/66fa69df-c041-499b-9867-5dec8475fc8d)

## Hello World

``` javascript
import { createRequestListener } from 'jambon';
import http from 'http';

const server = http.createServer(
	createRequestListener(helloWorld)
);

const port = process.env.PORT || 8000;

server.listen(port);

function helloWorld (context) {
	return {
		...context,
		response: {
			...context.response,
			headers: {
				...context.response.headers,
				'Content-Type': 'text/html'
			}
			body: 'Hello World',
			statusCode: 200
		}
	};
}
```

## Licence
The MIT License (MIT)

Copyright (c) 2018 [Jonatan Pedersen](https://www.jonatanpedersen.com/)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.