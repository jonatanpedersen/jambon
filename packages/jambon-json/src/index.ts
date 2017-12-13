import {AsyncReducerFunction, State} from 'jambon-core';

export const JSON_MIME_TYPE = 'application/json';

export async function jsonParseRequestBody (state : State) : Promise<State> {
	const body = JSON.parse(state.request.body);

	return {
		...state,
		request: {
			...state.request,
			body
		}
	};
}

export async function setResponseContentTypeHeaderToApplicationJson (state : State) : Promise<State> {
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

export async function jsonStringifyResponseBody (state : State) : Promise<State> {
	return {
		...state,
		response: {
			...state.response,
			body: json(state.response.body)
		}
	};
}

async function* json (obj: any) {
	throw new Error();
	if (isAsyncIterable(obj)) {
		console.log(123);
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
		console.log(23434);
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
		console.log(444123);
		const item = await obj;

		if (item) {
			yield JSON.stringify(item);
		}
	} else {
		console.log(55553);
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
