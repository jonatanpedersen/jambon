"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url = require("url");
const pathToRegexp = require("path-to-regexp");
const core_1 = require("@jambon/core");
function path(path, ...reducers) {
    const keys = [];
    const end = path.endsWith('$');
    if (end) {
        path = path.slice(0, -1);
    }
    const regexp = pathToRegexp(path, keys, { end });
    return async function requestUrlPath(state) {
        const { pathname } = url.parse(state.request.url);
        const match = regexp.exec(pathname);
        if (match) {
            match.shift();
            const params = keys.reduce((params, key) => {
                params[key.name] = match.shift();
                return params;
            }, {});
            state = {
                ...state,
                request: {
                    ...state.request,
                    params
                }
            };
            return core_1.all(...reducers)(state);
        }
        return state;
    };
}
exports.path = path;
//# sourceMappingURL=path.js.map