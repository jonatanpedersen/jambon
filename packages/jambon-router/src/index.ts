import * as url from 'url';
import * as pathToRegexp from 'path-to-regexp';
import {all, AsyncReducerFunction, State, HttpMethods} from 'jambon-core';

export function path (path : string, ...reducers : AsyncReducerFunction[]) {
	const keys = [];
	const regexp = pathToRegexp(path, keys, {end: false});

	return async function (state : State) : Promise<State> {
		const {pathname} = url.parse(state.request.url);
		const match = regexp.exec(pathname);

		if (match) {
			match.shift();

			const params = keys.reduce((params, key) => {
				params[key.name] = match.shift();
				return params;
			}, {});

			state = {
				...state,
				request: {
					...state.request,
					params
				}
			};

			return all(...reducers)(state);
		}

		return state;
	}
}

export function method (method: HttpMethods | string, ...reducers : AsyncReducerFunction[]) : AsyncReducerFunction {
	return async function requestMethodReducer (state : State) : Promise<State> {
		const requestMethod = state.request.method;

		if (requestMethod !== method) {
			return state;
		}

		return all(...reducers)(state);
	}
}

export const del = method.bind(null, HttpMethods.DELETE);
export const get = method.bind(null, HttpMethods.GET);
export const patch = method.bind(null, HttpMethods.PATCH);
export const post = method.bind(null, HttpMethods.POST);
export const put = method.bind(null, HttpMethods.PUT);


