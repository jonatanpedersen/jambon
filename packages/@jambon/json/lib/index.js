"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSON_MIME_TYPE = 'application/json';
async function jsonParseRequestBody(state) {
    const body = JSON.parse(state.request.body);
    return {
        ...state,
        request: {
            ...state.request,
            body
        }
    };
}
exports.jsonParseRequestBody = jsonParseRequestBody;
async function setResponseContentTypeHeaderToApplicationJson(state) {
    return {
        ...state,
        response: {
            ...state.response,
            headers: {
                ...state.response.headers,
                'content-type': exports.JSON_MIME_TYPE
            }
        }
    };
}
exports.setResponseContentTypeHeaderToApplicationJson = setResponseContentTypeHeaderToApplicationJson;
async function jsonStringifyResponseBody(state) {
    return {
        ...state,
        response: {
            ...state.response,
            body: json(state.response.body)
        }
    };
}
exports.jsonStringifyResponseBody = jsonStringifyResponseBody;
async function* json(obj) {
    if (isAsyncIterable(obj)) {
        let first = true;
        yield '[';
        for await (const item of obj) {
            if (first) {
                first = false;
            }
            else {
                yield ',';
            }
            yield JSON.stringify(item);
        }
        yield ']';
    }
    else if (isIterable(obj)) {
        let first = true;
        yield '[';
        for (const item of obj) {
            if (first) {
                first = false;
            }
            else {
                yield ',';
            }
            yield JSON.stringify(item || null);
        }
        yield ']';
    }
    else if (isPromise(obj)) {
        const item = await obj;
        if (item) {
            yield JSON.stringify(item);
        }
    }
    else {
        const item = obj;
        if (item) {
            yield JSON.stringify(item);
        }
    }
}
function isAsyncIterable(obj) {
    if (obj == null) {
        return false;
    }
    return typeof obj[Symbol.asyncIterator] === 'function';
}
function isIterable(obj) {
    if (obj == null) {
        return false;
    }
    return typeof obj[Symbol.iterator] === 'function';
}
function isPromise(obj) {
    if (obj == null) {
        return false;
    }
    return Promise.resolve(obj) == obj;
}
//# sourceMappingURL=index.js.map