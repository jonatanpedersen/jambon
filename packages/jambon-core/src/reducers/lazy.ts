import { HttpState } from "../HttpState";
import { AsyncReducerFunctionFactory } from "../AsyncReducerFunctionFactory";
import { AsyncReducerFunction } from "../AsyncReducerFunction";

export function lazy (factory : AsyncReducerFunctionFactory) : AsyncReducerFunction {
	return async function lazy (state : HttpState) : Promise<HttpState> {
		const reducer = factory();

		return reducer(state);
	}
}