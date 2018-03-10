"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url = require("url");
async function parseRequestQuery(state) {
    const { query } = url.parse(state.request.url, true);
    return {
        ...state,
        request: {
            ...state.request,
            query
        }
    };
}
exports.parseRequestQuery = parseRequestQuery;
//# sourceMappingURL=parseRequestQuery.js.map