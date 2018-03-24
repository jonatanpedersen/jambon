import * as url from 'url';
import { HttpContext } from '../HttpContext';
import { updateContext } from "../updateContext";

export async function parseRequestQuery (context : HttpContext) : Promise<HttpContext> {
	const { query } = url.parse(context.request.url, true);

	return updateContext(context, {
		request: {
			query
		}
	});
}