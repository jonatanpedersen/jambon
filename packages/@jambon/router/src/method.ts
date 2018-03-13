import * as url from 'url';
import * as pathToRegexp from 'path-to-regexp';
import {all, AsyncReducerFunction, HttpContext, HttpMethods} from '@jambon/core';

export function method (method: HttpMethods | string, ...reducers : AsyncReducerFunction[]) : AsyncReducerFunction {
	return async function requestMethod (context : HttpContext) : Promise<HttpContext> {
		const requestMethod = context.request.method;

		if (requestMethod !== method) {
			return context;
		}

		return all(...reducers)(context);
	}
}

export function del (...reducers : AsyncReducerFunction[]) : AsyncReducerFunction {
	return method(HttpMethods.DELETE, ...reducers);
}

export function get (...reducers : AsyncReducerFunction[]) : AsyncReducerFunction {
	return method(HttpMethods.GET, ...reducers);
}

export function patch (...reducers : AsyncReducerFunction[]) : AsyncReducerFunction {
	return method(HttpMethods.PATCH, ...reducers);
}

export function post (...reducers : AsyncReducerFunction[]) : AsyncReducerFunction {
	return method(HttpMethods.POST, ...reducers);
}

export function put (...reducers : AsyncReducerFunction[]) : AsyncReducerFunction {
	return method(HttpMethods.PUT, ...reducers);
}
