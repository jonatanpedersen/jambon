import { AsyncReducerFunction, HttpContext } from '@jambon/core';
import { join } from 'path';
import { parse as parseUrl } from 'url';
import { readFileSync } from 'fs';

export function dir (path : string) : AsyncReducerFunction {
	return async function dir (context : HttpContext) : Promise<HttpContext> {
		const { pathname } = parseUrl(context.request.url);

		const base = pathname ? join(path, pathname) : path;

		const files = [
			base,
			join(base, 'index.html')
		];

		let body;

		for (const file of files) {
			try {
				body = readFileSync(file)
				break;
			} catch (err) {
			}
		};

		if (!body) {
			return context;
		}

		return {
			...context,
			response: {
				...context.response,
				body
			}
		};
	}
}
