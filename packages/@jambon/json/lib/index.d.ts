import { HttpState } from '@jambon/core';
export declare const JSON_MIME_TYPE = "application/json";
export declare function jsonParseRequestBody(state: HttpState): Promise<HttpState>;
export declare function setResponseContentTypeHeaderToApplicationJson(state: HttpState): Promise<HttpState>;
export declare function jsonStringifyResponseBody(state: HttpState): Promise<HttpState>;
