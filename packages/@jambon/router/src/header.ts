import {all, AsyncReducerFunction, HttpContext} from '@jambon/core';

export function header (name : string, value : string, ...reducers : AsyncReducerFunction[]) : AsyncReducerFunction {
	return async function header (context : HttpContext) : Promise<HttpContext> {
		const requestHeader = context.request.headers[name];

		if (requestHeader !== value) {
			return context;
		}

		return all(...reducers)(context);
	}
}

export function accept (accept : string, ...reducers : AsyncReducerFunction[]) : AsyncReducerFunction {
	return header('accept', accept, ...reducers);
}

export function contentType (contentType : string, ...reducers : AsyncReducerFunction[]) : AsyncReducerFunction {
	return header('content-type', contentType, ...reducers);
}

export function host (host : string, ...reducers : AsyncReducerFunction[]) : AsyncReducerFunction {
	return header('host', host, ...reducers);
}
