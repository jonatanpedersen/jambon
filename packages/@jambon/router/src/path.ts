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
			pathname = (router && router.relativePath || url.parse(request.url).pathname).replace(INITIAL_SLASH, EMPTY_STRING);
		}

		const match = regexp.exec(pathname);

		if (match) {
			match.shift();

			const params = keys.reduce((params, key) => {
				params[key.name] = match.shift();
				return params;
			}, {});

			context = {
				...context,
				router: {
					...context.router,
					params: {
						...(context.router || {}).params,
						...params
					}
				}
			};

			const relativePath = pathname.replace(regexp, EMPTY_STRING);

			if (relativePath !== EMPTY_STRING) {
				context = {
					...context,
					router: {
						...context.router,
						relativePath
					}
				};
			} else {
				const newRouter = {...context.router};
				delete newRouter.relativePath;
				context = {
					...context,
					router: newRouter
				};
			}

			context = await all(...reducers)(context);
		}

		console.log(context);

		return context;
	}
}
