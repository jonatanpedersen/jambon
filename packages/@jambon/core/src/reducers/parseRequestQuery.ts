import * as url from 'url';
import { HttpContext } from '../HttpContext';

export async function parseRequestQuery (context : HttpContext) : Promise<HttpContext> {
	const {query} = url.parse(context.request.url, true);

	return {
		...context,
		request: {
			...context.request,
			query
		}
	};
}