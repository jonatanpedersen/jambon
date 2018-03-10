import { AsyncReducerFunction, HttpState } from '@jambon/core';
export declare function path(path: string, ...reducers: AsyncReducerFunction[]): (state: HttpState) => Promise<HttpState>;
