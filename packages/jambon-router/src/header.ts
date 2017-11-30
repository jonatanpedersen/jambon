import {all, AsyncReducerFunction, State} from 'jambon-core';

export function header (name : string, value : string, ...reducers : AsyncReducerFunction[]) : AsyncReducerFunction {
	return async function header (state : State) : Promise<State> {
		const requestHeader = state.request.headers[name];

		if (requestHeader !== value) {
			return state;
		}

		return all(...reducers)(state);
	}
}

export function accept (accept : string, ...reducers : AsyncReducerFunction[]) : AsyncReducerFunction {
	return header('accept', accept, ...reducers);
}

export function contentType (contentType : string, ...reducers : AsyncReducerFunction[]) : AsyncReducerFunction {
	return header('content-type', contentType, ...reducers);
}