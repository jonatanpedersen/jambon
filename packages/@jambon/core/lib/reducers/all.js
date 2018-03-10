"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function all(...reducers) {
    return async function all(state) {
        for (const reducer of reducers) {
            state = await reducer(state);
        }
        return state;
    };
}
exports.all = all;
//# sourceMappingURL=all.js.map