import { HttpHeaders } from "./HttpHeaders";
import { HttpMethods } from "./HttpMethods";

export interface HttpRequest {
	body?: any,
	headers: HttpHeaders,
	method: HttpMethods | string,
	url: string,
	[key: string]: any
}