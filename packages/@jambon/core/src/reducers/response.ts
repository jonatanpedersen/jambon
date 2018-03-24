import { AsyncReducerFunction } from "../AsyncReducerFunction";
import { AsyncMatcherFunction } from "../AsyncMatcherFunction";
import { HttpContext } from "../HttpContext";
import { updateContext } from "../updateContext";

export function setResponseBody (body : any) : AsyncReducerFunction {
	return async function setResponseBody (context : HttpContext) : Promise<HttpContext> {
		return updateContext(context, {
			response: {
				body
			}
		});
	}
}

export function setResponseContentTypeHeader (contentType : string) : AsyncReducerFunction {
	return async function setResponseContentTypeHeader (context : HttpContext) : Promise<HttpContext> {
		return updateContext(context, {
			response: {
				headers: {
					'Content-Type': contentType
				}
			}
		});
	}
}

export function setStatusCode (statusCode : number) : AsyncReducerFunction {
	return async function setStatusCode (context : HttpContext) : Promise<HttpContext> {
		return updateContext(context, {
			response: {
				statusCode
			}
		});
	}
}
