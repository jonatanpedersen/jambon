import { HttpStatusCodes } from "./HttpStatusCodes";
import { HttpHeaders } from "./HttpHeaders";

export interface HttpResponse {
	body?: any,
	headers?: HttpHeaders,
	statusCode?: HttpStatusCodes | number,
	statusMessage?: string,
	[key: string]: any
}