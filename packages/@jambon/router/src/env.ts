import { match, AsyncReducerFunction, HttpContext } from '@jambon/core';

export function env (name : string, value : string, ...reducers : AsyncReducerFunction[]) : AsyncReducerFunction {
	return async function env (context : HttpContext) : Promise<HttpContext> {
		return match(async context => process.env[name] !== value)(context);
	}
}