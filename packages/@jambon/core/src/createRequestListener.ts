import * as util from 'util';
import * as url from 'url';
import * as streamTostring from 'stream-to-string';
import { AsyncReducerFunction } from './AsyncReducerFunction';
import { IncomingMessage, ServerResponse } from 'http';
import { RequestListenerFunction } from './RequestListenerFunction';
import { HttpState } from './HttpState';
import { all } from './reducers/all';

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

		const initialState : HttpState = {
			request: {
				method,
				body,
				headers,
				url
			},
			context: {}
		};

		const finalState : HttpState = await all(...reducers)(initialState);

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
