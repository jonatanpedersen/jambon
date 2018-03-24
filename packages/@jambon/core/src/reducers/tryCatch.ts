import { AsyncReducerFunction } from "../AsyncReducerFunction";
import { AsyncMatcherFunction } from "../AsyncMatcherFunction";
import { HttpContext } from "../HttpContext";
import { HttpError } from "../HttpErrors";
import { updateContext } from "../updateContext";
import { HttpStatusCodes } from '../HttpStatusCodes';

export function tryCatch (handler, ...reducers : AsyncReducerFunction[]) : AsyncReducerFunction {
	return async function trycatch (context) {
		try {
			for (const reducer of reducers) {
				context = await reducer(context);
			}

			return context;
		} catch (error) {
			handler = handler || defaultErrorHandler;

			return handler(error, context);
		}
	}
}

export async function defaultErrorHandler (error : Error, context : HttpContext) {
	const { message, stack } = error;

	let statusCode = HttpStatusCodes.INTERNAL_SERVER_ERROR;

	if (error instanceof HttpError) {
		statusCode = error.statusCode;
	}

	return updateContext(context, {
		response: {
			body: JSON.stringify({message, stack}),
			statusCode
		}
	});
}
