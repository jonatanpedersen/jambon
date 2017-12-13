import { HttpState } from "../HttpState";

export async function lowerCaseRequestHeaders (state : HttpState) : Promise<HttpState> {
	const headers = {};

	for (const header in state.request.headers) {
		const lowerCaseHeader = header.toLowerCase();
		headers[lowerCaseHeader] = state.request.headers[header];
	}

	return {...state, request: {...state.request, headers}};
}