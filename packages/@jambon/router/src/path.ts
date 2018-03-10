import * as url from 'url';
import * as pathToRegexp from 'path-to-regexp';
import { all, AsyncReducerFunction, HttpState } from '@jambon/core';
import { createDebug } from './debug';

const debug = createDebug('jambon:path');

export function path (path : string, ...reducers : AsyncReducerFunction[]) {
	const keys = [];
	const end = path.endsWith(DOLLAR_SIGN);
	const absolute = path.startsWith(SLASH);

	if (end) {
		path = path.slice(0, -1);
	}

	const regexp = pathToRegexp(path, keys, {end});

	return async function requestUrlPath (state : HttpState) : Promise<HttpState> {
		const { request, response, context } = state;

		let pathname;

		if (absolute) {
			pathname = url.parse(request.url).pathname;
		} else {
			pathname = (context.relativePath || url.parse(request.url).pathname).replace(INITIAL_SLASH, EMPTY_STRING);
		}

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

			const relativePath = pathname.replace(regexp, EMPTY_STRING);

			if (relativePath !== EMPTY_STRING) {
				state = {
					...state,
					context: {
						...state.context,
						relativePath
					}
				};
			} else {
				const newContext = {...state.context};
				delete newContext.relativePath;
				state = {
					...state,
					context: newContext
				};
			}

			state = await all(...reducers)(state);
		}

		return state;
	}
}

const EMPTY_STRING = '';
const INITIAL_SLASH = /^\//;
const DOLLAR_SIGN = '$';
const SLASH = '/';