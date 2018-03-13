import { HttpContext } from "../HttpContext";
import { AsyncReducerFunctionFactory } from "../AsyncReducerFunctionFactory";
import { AsyncReducerFunction } from "../AsyncReducerFunction";

export function lazy (factory : AsyncReducerFunctionFactory) : AsyncReducerFunction {
	return async function lazy (context : HttpContext) : Promise<HttpContext> {
		const reducer = factory();

		return reducer(context);
	}
}