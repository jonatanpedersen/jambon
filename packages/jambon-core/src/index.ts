import * as util from 'util';
import * as url from 'url';
import * as streamTostring from 'stream-to-string';
import {IncomingMessage, ServerResponse} from 'http';

export type AsyncReducerFunctionFactory = () => AsyncReducerFunction[];
export type AsyncReducerFunction = (state : State) => Promise<State>;
export type ReducerFunction = (state : State) => State;
export type RequestListenerFunction = (req: IncomingMessage, res: ServerResponse) => void;

export interface State {
	request: Request,
	response?: Response,
}

export interface Request {
	body?: any,
	headers: HttpHeaders,
	method: HttpMethods | string,
	url: string,
	[key: string]: any
}

export interface Response {
	body?: any,
	headers?: HttpHeaders,
	statusCode?: HttpStatusCode | number,
	statusMessage?: string,
	[key: string]: any
}

export interface HttpHeaders {
	[header: string]: number | string | string[] | undefined;
}

export enum HttpMethods {
	GET = "GET",
	DELETE = "DELETE",
	PATCH = "PATCH",
	POST = "POST",
	PUT = "PUT"
}

export enum HttpStatusCode {
	OK = 200,
	NO_CONTENT = 204,
	CREATED = 201,
	MOVED_PERMANENTLY = 301,
	FOUND = 302,
	BAD_REQUEST = 400,
	UNAUTHORIZED = 401,
	FORBIDDEN = 403,
	NOT_FOUND = 404,
	METHOD_NOT_ALLOWED = 404,
	INTERNAL_SERVER_ERROR = 500
}

export function createRequestListener (...reducers: AsyncReducerFunction[]) : RequestListenerFunction {
	return requestListener;

	function requestListener (req: IncomingMessage, res: ServerResponse) {
		handlerAsync(req, res).catch(err => {
			console.error(err);
			process.exit(1);
		});
	}

	async function handlerAsync (req: IncomingMessage, res: ServerResponse) {
		const {headers, method, url} = req;
		const body = await streamTostring(req);

		const initialState : State = {
			request: {
				method,
				body,
				headers,
				url
			}
		};

		const finalState : State = await all(...reducers)(initialState);

		if (finalState.response) {
			if (finalState.response.headers) {
				for (let header in finalState.response.headers) {
					res.setHeader(header, finalState.response.headers[header]);
				}
			}

			if (finalState.response.statusMessage) {
				res.statusMessage = finalState.response.statusMessage;
			}

			if (finalState.response.statusCode) {
				res.statusCode = finalState.response.statusCode;
			}

			if (finalState.response.body) {
				await forEach(finalState.response.body, str => {
					res.write(str);
				});
			}
		}

		res.end();
	}
}

export async function notFound (state : State) : Promise<State> {
	if (state.response) {
		return state;
	}

	return {
		...state,
		response: {
			statusCode: 404
		}
	};
}

export async function lowerCaseRequestHeaders (state : State) : Promise<State> {
	const headers = {};

	for (const header in state.request.headers) {
		const lowerCaseHeader = header.toLowerCase();
		headers[lowerCaseHeader] = state.request.headers[header];
	}

	return {...state, request: {...state.request, headers}};
}

export async function parseRequestQuery (state : State) : Promise<State> {
	const {query} = url.parse(state.request.url, true);

	return {
		...state,
		request: {
			...state.request,
			query
		}
	};
}

export function lazy  (factory : AsyncReducerFunctionFactory) : AsyncReducerFunction {
	return async function lazy  (state : State) : Promise<State> {
		const reducers = factory();

		return all(...reducers)(state);
	}
}

export async function log (state : State) : Promise<State> {
	console.log(JSON.stringify(state, null, 4));

	return state;
}

export function all (...reducers : AsyncReducerFunction[]) : AsyncReducerFunction {
	return async function all (state : State) : Promise<State> {
		for (const reducer of reducers) {
			state = await reducer(state);
		}

		return state;
	}
}

export async function forEach(asyncIterator, fn) : Promise<void> {
	const {value, done} = await asyncIterator.next();

	if (done === true) {
		return;
	}

	fn(value);

	await forEach(asyncIterator, fn);
}

export async function* text (str: any) {
	yield str;
}
