import * as url from 'url';
import { HttpState } from '../HttpState';

export async function parseRequestQuery (state : HttpState) : Promise<HttpState> {
	const {query} = url.parse(state.request.url, true);

	return {
		...state,
		request: {
			...state.request,
			query
		}
	};
}