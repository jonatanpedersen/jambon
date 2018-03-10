"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@jambon/core");
function header(name, value, ...reducers) {
    return async function header(state) {
        const requestHeader = state.request.headers[name];
        if (requestHeader !== value) {
            return state;
        }
        return core_1.all(...reducers)(state);
    };
}
exports.header = header;
function accept(accept, ...reducers) {
    return header('accept', accept, ...reducers);
}
exports.accept = accept;
function contentType(contentType, ...reducers) {
    return header('content-type', contentType, ...reducers);
}
exports.contentType = contentType;
//# sourceMappingURL=header.js.map