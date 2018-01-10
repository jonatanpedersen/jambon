import { AsyncReducerFunction } from "../AsyncReducerFunction";
import { HttpState } from "../HttpState";

export function all (...reducers : AsyncReducerFunction[]) : AsyncReducerFunction {
	return async function all (state : HttpState) : Promise<HttpState> {
		for (const reducer of reducers) {
			state = await reducer(state);
		}

		return state;
	}
}
