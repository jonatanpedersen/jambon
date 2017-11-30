import * as url from 'url';
import * as pathToRegexp from 'path-to-regexp';
import {all, AsyncReducerFunction, State, HttpMethods} from 'jambon-core';

export function method (method: HttpMethods | string, ...reducers : AsyncReducerFunction[]) : AsyncReducerFunction {
	return async function requestMethod (state : State) : Promise<State> {
		const requestMethod = state.request.method;

		if (requestMethod !== method) {
			return state;
		}

		return all(...reducers)(state);
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
