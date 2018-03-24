import { match, AsyncReducerFunction, HttpContext } from '@jambon/core';

export function def (...reducers : AsyncReducerFunction[]) : AsyncReducerFunction {
	return async function def (context : HttpContext) : Promise<HttpContext> {
		return match(async context => context.response === undefined, ...reducers)(context);
	}
}
