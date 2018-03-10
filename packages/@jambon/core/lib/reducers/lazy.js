"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function lazy(factory) {
    return async function lazy(state) {
        const reducer = factory();
        return reducer(state);
    };
}
exports.lazy = lazy;
//# sourceMappingURL=lazy.js.map