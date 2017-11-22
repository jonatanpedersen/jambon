import url from 'url';
import pathToRegexp from 'path-to-regexp';
import {all} from 'jambon-core';

export function path (path, ...reducers) {
	const keys = [];
	const regexp = pathToRegexp(path, keys, {end: false});

	return async function (state) {
		const {pathname} = url.parse(state.request.url);
		const match = regexp.exec(pathname);

		if (match) {
			match.shift();

			const params = keys.reduce((params, key) => {
				params[key.name] = match.shift();
				return params;
			}, {});

			state = {...state, request: {...state.request, params}};

			return all(...reducers)(state);
		}

		return state;
	}
}

export function method (method, ...reducers) {
	return async function (state) {
		const requestMethod = state.request.method;

		if (requestMethod !== method) {
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
