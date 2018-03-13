import { AsyncReducerFunction } from "../AsyncReducerFunction";
import { HttpContext } from "../HttpContext";

export function all (...reducers : AsyncReducerFunction[]) : AsyncReducerFunction {
	return async function all (context : HttpContext) : Promise<HttpContext> {
		for (const reducer of reducers) {
			context = await reducer(context);
		}

		return context;
	}
}
