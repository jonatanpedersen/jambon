import { parse as parseUrl, format as formatUrl } from 'url';
import * as pathToRegexp from 'path-to-regexp';
import { all, AsyncReducerFunction, HttpContext } from '@jambon/core';
import { createDebug } from './debug';

const debug = createDebug('jambon:path');

const EMPTY_STRING = '';
const INITIAL_SLASH = /^\//;
const TRAILING_SLASH = /\/$/;
const DOLLAR_SIGN = '$';
const SLASH = '/';

export function path (path : string, ...reducers : AsyncReducerFunction[]) {
	const keys = [];
	const end = path.endsWith(DOLLAR_SIGN);
	const absolute = path.startsWith(SLASH);

	if (absolute) {
		throw new Error('path must be relative');
	}

	if (end) {
		path = path.slice(0, -1);
	}

	const regexp = pathToRegexp(path, keys, {end});

	return async function requestUrlPath (context : HttpContext) : Promise<HttpContext> {
		const { request, response, router } = context;
		const { url } = request;
		const parts = parseUrl(request.url);
		const pathname = parts.pathname.replace(INITIAL_SLASH, EMPTY_STRING);

		const match = regexp.exec(pathname);

		if (match) {
			context = {
				...context,
				request: {
					...context.request,
					url: formatUrl({
						...parts,
						pathname: pathname.replace(regexp, EMPTY_STRING)
					})
				},
				router: {
					...router,
					path: [(router || {}).path, match.shift().replace(TRAILING_SLASH, EMPTY_STRING)].join('/'),
					params: {
						...(router || {}).params,
						...keys.reduce((params, key) => {
							params[key.name] = match.shift();
							return params;
						}, {})
					}
				}
			}

			for (const reducer of reducers) {
				context = await reducer(context);
			}

			context = {
				...context,
				request: {
					...context.request,
					url
				},
				router
			}
		}

		return context;
	}
}
