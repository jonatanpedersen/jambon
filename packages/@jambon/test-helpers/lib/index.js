"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
require("mocha");
function noop() {
    return async function noop(state) {
        return {
            ...state,
            response: {
                statusCode: 200
            }
        };
    };
}
exports.noop = noop;
function describeAsyncReducer(...tests) {
    tests.forEach(test => describeAsyncReducerTest(test));
}
exports.describeAsyncReducer = describeAsyncReducer;
function describeAsyncReducerTest(test) {
    let describeFunction = describe;
    if (test.only) {
        describeFunction = describe.only;
    }
    if (test.skip) {
        describeFunction = describe.skip;
    }
    describeFunction(test.description, () => {
        let actualFinalState;
        before(async () => {
            actualFinalState = await test.asyncReducer(test.initialState);
        });
        it('actual final state should deep equal expected final state', () => {
            chai_1.expect(actualFinalState).to.deep.equal(test.expectedFinalState);
        });
    });
}
exports.describeAsyncReducerTest = describeAsyncReducerTest;
;
//# sourceMappingURL=index.js.map