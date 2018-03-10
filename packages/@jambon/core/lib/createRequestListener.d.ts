import { AsyncReducerFunction } from './AsyncReducerFunction';
import { RequestListenerFunction } from './RequestListenerFunction';
export declare function createRequestListener(...reducers: AsyncReducerFunction[]): RequestListenerFunction;
export declare function forEach(asyncIterator: any, fn: any): Promise<void>;
export declare function text(str: any): AsyncIterableIterator<any>;
