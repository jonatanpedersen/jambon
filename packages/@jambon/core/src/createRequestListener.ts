import * as util from 'util';
import * as url from 'url';
import * as streamTostring from 'stream-to-string';
import { AsyncReducerFunction } from './AsyncReducerFunction';
import { IncomingMessage, ServerResponse } from 'http';
import { RequestListenerFunction } from './RequestListenerFunction';
import { HttpContext } from './HttpContext';
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

		const initialContext : HttpContext = {
			request: {
				method,
				body,
				headers,
				url
			}
		};

		const finalContext : HttpContext = await all(...reducers)(initialContext);

		if (finalContext.response) {
			if (finalContext.response.headers) {
				for (let header in finalContext.response.headers) {
					res.setHeader(header, finalContext.response.headers[header]);
				}
			}

			if (finalContext.response.statusMessage) {
				res.statusMessage = finalContext.response.statusMessage;
			}

			if (finalContext.response.statusCode) {
				res.statusCode = finalContext.response.statusCode;
			}

			if (finalContext.response.body) {
				if (finalContext.response.body instanceof Buffer) {
					res.write(finalContext.response.body);
				} else  {
					await forEach(finalContext.response.body, str => {
						res.write(str);
					});
				}
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
