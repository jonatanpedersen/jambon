import { AsyncReducerFunction } from '@jambon/core';
export declare function header(name: string, value: string, ...reducers: AsyncReducerFunction[]): AsyncReducerFunction;
export declare function accept(accept: string, ...reducers: AsyncReducerFunction[]): AsyncReducerFunction;
export declare function contentType(contentType: string, ...reducers: AsyncReducerFunction[]): AsyncReducerFunction;
