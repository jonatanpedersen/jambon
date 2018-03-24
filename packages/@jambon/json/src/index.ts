import { AsyncReducerFunction, HttpContext, updateContext } from '@jambon/core';

export const JSON_MIME_TYPE = 'application/json';
export const CONTENT_TYPE_RESPONSE_HEADER = 'content-type';

export async function jsonParseRequestBody (context : HttpContext) : Promise<HttpContext> {
	const body = JSON.parse(context.request.body);

	return updateContext(context, {
		request: {
			body
		}
	});
}

export async function setResponseContentTypeHeaderToApplicationJson (context : HttpContext) : Promise<HttpContext> {
	return updateContext(context, {
		response: {
			headers: {
				[CONTENT_TYPE_RESPONSE_HEADER]: JSON_MIME_TYPE
			}
		}
	});
}

export async function jsonStringifyResponseBody (context : HttpContext) : Promise<HttpContext> {
	return updateContext(context, {
		response: {
			body: json(context.response.body)
		}
	});
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
