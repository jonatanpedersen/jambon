import { AsyncReducerFunction, HttpContext, updateContext } from '@jambon/core';

export const ACCESS_CONTROL_ALLOW_ORIGIN_RESPONSE_HEADER = 'Access-Control-Allow-Origin';
export const ACCESS_CONTROL_ALLOW_CREDENTIALS_RESPONSE_HEADER = 'Access-Control-Allow-Credentials';
export const ACCESS_CONTROL_ALLOW_METHODS_RESPONSE_HEADER = 'Access-Control-Allow-Methods';
export const ACCESS_CONTROL_ALLOW_HEADERS_RESPONSE_HEADER = 'Access-Control-Allow-Headers';

export async function setAccessControlResponseHeaders (context : HttpContext) : Promise<HttpContext> {
	const origin = context.request.headers.origin || '*';

	return updateContext(context, {
		response: {
			headers: {
				[ACCESS_CONTROL_ALLOW_ORIGIN_RESPONSE_HEADER]: origin,
				[ACCESS_CONTROL_ALLOW_CREDENTIALS_RESPONSE_HEADER]: 'true',
				[ACCESS_CONTROL_ALLOW_METHODS_RESPONSE_HEADER]: 'GET, POST, PUT, DELETE',
				[ACCESS_CONTROL_ALLOW_HEADERS_RESPONSE_HEADER]: '*',
			}
		}
	});
}

