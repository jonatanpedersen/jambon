"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@jambon/core");
function method(method, ...reducers) {
    return async function requestMethod(state) {
        const requestMethod = state.request.method;
        if (requestMethod !== method) {
            return state;
        }
        return core_1.all(...reducers)(state);
    };
}
exports.method = method;
function del(...reducers) {
    return method(core_1.HttpMethods.DELETE, ...reducers);
}
exports.del = del;
function get(...reducers) {
    return method(core_1.HttpMethods.GET, ...reducers);
}
exports.get = get;
function patch(...reducers) {
    return method(core_1.HttpMethods.PATCH, ...reducers);
}
exports.patch = patch;
function post(...reducers) {
    return method(core_1.HttpMethods.POST, ...reducers);
}
exports.post = post;
function put(...reducers) {
    return method(core_1.HttpMethods.PUT, ...reducers);
}
exports.put = put;
//# sourceMappingURL=method.js.map