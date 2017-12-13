import {AsyncReducerFunction, HttpState} from 'jambon-core';

export const JSON_MIME_TYPE = 'application/json';

export async function jsonParseRequestBody (state : HttpState) : Promise<HttpState> {
	const body = JSON.parse(state.request.body);

	return {
		...state,
		request: {
			...state.request,
			body
		}
	};
}

export async function setResponseContentTypeHeaderToApplicationJson (state : HttpState) : Promise<HttpState> {
	return {
		...state,
		response: {
			...state.response,
			headers: {
				...state.response.headers,
				'content-type': JSON_MIME_TYPE
			}
		}
	};
}

export async function jsonStringifyResponseBody (state : HttpState) : Promise<HttpState> {
	return {
		...state,
		response: {
			...state.response,
			body: json(state.response.body)
		}
	};
}

async function* json (obj: any) {
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

function isAsyncIterable(obj) : boolean {
	if (obj == null) {
		return false;
	}

	return typeof obj[Symbol.asyncIterator] === 'function';
}

function isIterable(obj) : boolean {
	if (obj == null) {
		return false;
	}

	return typeof obj[Symbol.iterator] === 'function';
}

function isPromise(obj) : boolean {
	if (obj == null) {
		return false;
	}

	return Promise.resolve(obj) == obj;
}
