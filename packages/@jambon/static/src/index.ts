import { AsyncReducerFunction, HttpContext } from '@jambon/core';
import { join, parse as parsePath } from 'path';
import { parse as parseUrl } from 'url';
import { createReadStream, readFileSync } from 'fs';

export function dir (path : string) : AsyncReducerFunction {
	return async function dir (context : HttpContext) : Promise<HttpContext> {
		let { pathname } = parseUrl(context.request.url);

		// Remove startling slash
		pathname = pathname.replace(/^\//, '');

		// Add default document
		if (pathname.endsWith('/')) {
			pathname += 'index.html';
		}

		const file = join(pathname);
		const body = readFileSync(file);

		return {
			...context,
			response: {
				...context.response,
				body
			}
		};
	}
}
