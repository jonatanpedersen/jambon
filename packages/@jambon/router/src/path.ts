import * as url from 'url';
import * as pathToRegexp from 'path-to-regexp';
import { all, AsyncReducerFunction, HttpContext } from '@jambon/core';
import { createDebug } from './debug';

const debug = createDebug('jambon:path');

const EMPTY_STRING = '';
const INITIAL_SLASH = /^\//;
const DOLLAR_SIGN = '$';
const SLASH = '/';

export function path (path : string, ...reducers : AsyncReducerFunction[]) {
	const keys = [];
	const end = path.endsWith(DOLLAR_SIGN);
	const absolute = path.startsWith(SLASH);

	if (end) {
		path = path.slice(0, -1);
	}

	const regexp = pathToRegexp(path, keys, {end});

	return async function requestUrlPath (context : HttpContext) : Promise<HttpContext> {
		const { request, response, router } = context;

		let pathname;

		if (absolute) {
			pathname = url.parse(request.url).pathname;
		} else {
			if (router && router.relativePath !== undefined) {
				pathname = router.relativePath;
			} else {
				pathname = url.parse(request.url).pathname;
			}

			pathname = pathname.replace(INITIAL_SLASH, EMPTY_STRING);
		}

		const match = regexp.exec(pathname);

		if (match) {
			match.shift();

			const params = keys.reduce((params, key) => {
				params[key.name] = match.shift();
				return params;
			}, {});

			let newRouter = { ...context.router };

			newRouter = {
				...newRouter || {},
				params: {
					...(newRouter || {}).params,
					...params
				}
			}

			const relativePath = pathname.replace(regexp, EMPTY_STRING);

			newRouter = {
				...newRouter,
				relativePath
			};

			for (const reducer of reducers) {
				context = await reducer({...context, router: newRouter });
			}

			context = {...context, router }
		}

		return context;
	}
}
