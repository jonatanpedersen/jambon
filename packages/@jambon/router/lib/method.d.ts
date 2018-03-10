import { AsyncReducerFunction, HttpMethods } from '@jambon/core';
export declare function method(method: HttpMethods | string, ...reducers: AsyncReducerFunction[]): AsyncReducerFunction;
export declare function del(...reducers: AsyncReducerFunction[]): AsyncReducerFunction;
export declare function get(...reducers: AsyncReducerFunction[]): AsyncReducerFunction;
export declare function patch(...reducers: AsyncReducerFunction[]): AsyncReducerFunction;
export declare function post(...reducers: AsyncReducerFunction[]): AsyncReducerFunction;
export declare function put(...reducers: AsyncReducerFunction[]): AsyncReducerFunction;
