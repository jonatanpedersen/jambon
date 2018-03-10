import 'mocha';
import { HttpState, AsyncReducerFunction } from '@jambon/core';
export interface AsyncReducerTest {
    only?: boolean;
    skip?: boolean;
    description: string;
    asyncReducer: AsyncReducerFunction;
    initialState: HttpState;
    expectedFinalState: HttpState;
}
export declare function noop(): (state: HttpState) => Promise<HttpState>;
export declare function describeAsyncReducer(...tests: AsyncReducerTest[]): void;
export declare function describeAsyncReducerTest(test: AsyncReducerTest): void;
