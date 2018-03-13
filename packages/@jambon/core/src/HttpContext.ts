import { HttpRequest } from "./HttpRequest";
import { HttpResponse } from "./HttpResponse";

export interface HttpContext {
	request: HttpRequest,
	response?: HttpResponse,
	[key: string]: any
}