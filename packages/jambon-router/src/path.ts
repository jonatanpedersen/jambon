import * as url from 'url';
import * as pathToRegexp from 'path-to-regexp';
import {all, AsyncReducerFunction, HttpState} from 'jambon';

export function path (path : string, ...reducers : AsyncReducerFunction[]) {
	const keys = [];
	const end = path.endsWith('$');

	if (end) {
		path = path.slice(0, -1);
	}

	const regexp = pathToRegexp(path, keys, {end});

	return async function requestUrlPath (state : HttpState) : Promise<HttpState> {
		const {pathname} = url.parse(state.request.url);
		const match = regexp.exec(pathname);

		if (match) {
			match.shift();

			const params = keys.reduce((params, key) => {
				params[key.name] = match.shift();
				return params;
			}, {});

			state = {
				...state,
				request: {
					...state.request,
					params
				}
			};

			return all(...reducers)(state);
		}

		return state;
	}
}
