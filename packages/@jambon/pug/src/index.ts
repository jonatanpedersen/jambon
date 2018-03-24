import { setResponseBody, AsyncReducerFunction, HttpContext } from '@jambon/core';
import { renderFile } from 'pug';

export function pugFile (file : string) : AsyncReducerFunction {
	return async function pugFile (context : HttpContext) : Promise<HttpContext> {
		return setResponseBody(renderFile(file, context))(context);
	}
}
