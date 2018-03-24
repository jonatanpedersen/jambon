import { AsyncReducerFunction } from "../AsyncReducerFunction";
import { AsyncMatcherFunction } from "../AsyncMatcherFunction";
import { HttpContext } from "../HttpContext";

export function match (matcher : AsyncMatcherFunction, ...reducers : AsyncReducerFunction[]) : AsyncReducerFunction {
	return async function match (context : HttpContext) : Promise<HttpContext> {
		const isMatch = await matcher(context);

		if (isMatch) {
			for (const reducer of reducers) {
				context = await reducer(context);
			}
		}

		return context;
	}
}
