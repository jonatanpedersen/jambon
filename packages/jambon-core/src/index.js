import util from 'util';
import url2 from 'url';
import streamToString from 'stream-to-string';

export function jambon (...reducers) {
	function handler (req, res) {
		handlerAsync(req, res).catch(err => {
			console.error(err);
			process.exit(1);
		});
	}

	async function handlerAsync (req, res) {
		const {headers, method, url} = req;
		const body = await streamToString(req);

		const {request, response} = await all(...reducers)({
			request: {
				method,
				body,
				headers,
				url
			},
			response: {}
		});

		if (response.headers) {
			for (let header in response.headers) {
				res.setHeader(header, response.headers[header]);
			}
		}

		if (response.statusMessage) {
			res.statusMessage = response.statusMessage;
		}

		if (response.statusCode) {
			res.statusCode = response.statusCode;
		}

		if (response.body) {
			await forEach(response.body, str => {
				res.write(str);
			});
		}

		res.end();
	}

	return handler;
}

export async function setResponseContentTypeHeaderToApplicationJson ({request, response}) {
	return {
		request,
		response: {
			...response,
			headers: {...response.headers, 'Content-Type': 'application/json'}
		}
	};
}

export async function jsonStringifyResponseBody ({request, response}) {
	return {
		request,
		response: {
			...response,
			body: json(response.body)
		}
	};
}

export async function jsonResponse (state) {
	return all(
		setResponseContentTypeHeaderToApplicationJson,
		jsonStringifyResponseBody
	)(state);
}

export async function* json (obj) {
	if (isAsyncIterable(obj)) {
		let first = true;
		yield '[';

		for await (const item of obj) {
			if (first) {
				first = false;
			} else {
				yield ',';
			}

			yield JSON.stringify(item);
		}

		yield ']';
	} else if (isIterable(obj)) {
		let first = true;
		yield '[';

		for (const item of obj) {
			if (first) {
				first = false;
			} else {
				yield ',';
			}

			yield JSON.stringify(item || null);
		}

		yield ']';
	} else if (isPromise(obj)) {
		const item = await obj;

		if (item) {
			yield JSON.stringify(item);
		}
	} else {
		const item = obj;

		if (item) {
			yield JSON.stringify(item);
		}
	}
}

export async function lowerCaseRequestHeaders (state) {
	const headers = {};

	for (const header in state.request.headers) {
		const lowerCaseHeader = header.toLowerCase();
		headers[lowerCaseHeader] = state.request.headers[header];
	}

	return {...state, request: {...state.request, headers}};
}

export async function parseRequestBody (state) {
	const contentType = state.request.headers['content-type'];

	if (contentType === 'application/json') {
		const body = JSON.parse(state.request.body);

		return {...state, request: {...state.request, body}};
	}

	return state;
}

export async function parseRequestQuery (state) {
	const {query} = url2.parse(state.request.url, true);

	return {...state, request: {...state.request, query}};
}

export function all (...reducers) {
	return async function (state) {
		for (const reducer of reducers) {
			state = await reducer(state);
		}

		return state;
	}
}

export function path (path, ...reducers) {
	return async function (state) {
		const {pathname} = url2.parse(state.request.url);

		if(!path.test(pathname)) {
			return state;
		}

		return all(...reducers)(state);
	}
}

export function method (method, ...reducers) {
	return async function (state) {
		if (state.request.method !== method) {
			return state;
		}

		return all(...reducers)(state);
	}
}

export const del = method.bind(null, 'DELETE');
export const get = method.bind(null, 'GET');
export const patch = method.bind(null, 'PATCH');
export const post = method.bind(null, 'POST');
export const put = method.bind(null, 'PUT');

export function isAsyncIterable(obj) {
	// checks for null and undefined
	if (obj == null) {
		return false;
	}

	return typeof obj[Symbol.asyncIterator] === 'function';
}

export function isIterable(obj) {
	// checks for null and undefined
	if (obj == null) {
		return false;
	}

	return typeof obj[Symbol.iterator] === 'function';
}

export function isPromise(obj) {
	// checks for null and undefined
	if (obj == null) {
		return false;
	}

	return Promise.resolve(obj) == obj;
}

export async function* iterableCursor(cursor) {
	try {
		cursor[Symbol.asyncIterator] = () => {};

		while (await cursor.hasNext()) {
			yield await cursor.next();
		}
	} finally {
		await cursor.close();
	}
}

export async function forEach(ai, fn) {
	return ai.next().then(r => {
		if (!r.done) {
			fn(r.value);

			return forEach(ai, fn);
		}
	});
}
