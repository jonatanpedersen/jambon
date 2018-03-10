import { HttpRequest } from "./HttpRequest";
import { HttpResponse } from "./HttpResponse";

export interface HttpState {
	request: HttpRequest,
	response?: HttpResponse,
	context?: any
}