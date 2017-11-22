import util from 'util';

export function jambon (reducer) {
	async function handle (req, res) {
		const {body, headers, params, query} = req;
		const {request, response} = await reducer({
			request: {
				body,
				headers,
				params,
				query
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

		await forEach(response.body, str => {
			res.write(str);
		});

		res.end();
	}

	return handle;
}

export function bridge (reducer) {
	async function handle (req, res) {
		const {body, headers, params, query} = req;
		const {request, response} = await reducer({
			request: {
				body,
				headers,
				params,
				query
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
			res.status(response.statusCode);
		}

		await forEach(response.body, str => {
			res.write(str);
		});

		res.end();
	}

	return util.callbackify(handle);
}

export async function jsonResponse ({request, response}) {
	return {
		request,
		response: {
			...response,
			body: json(response.body),
			headers: {...response.headers, 'Content-Type': 'application/json'}
		}
	};
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

export function compositeReducer (...reducers) {
	return async function (state) {
		for (let reducer of reducers) {
			state = await reducer(state);
		}

		return state;
	}
}

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
