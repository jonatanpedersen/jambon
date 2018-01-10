# jambon-router

```
$ npm install jambon-router
```

## API
### path

``` javascript
function path(path: string, ...reducers: (async state => state)[]) : async state => state
```

Import `path` function:
``` javascript
import {path} from 'jambon-router'
```


Match requests where path starts with `/api`:
``` javascript
const reducer = path('/api', ...reducers});
```

Match requests where path is exactly `/api/foos`:

``` javascript
const reducer = path('/api/foos$', async (state) => {
	const foos = await getFoos();

	return {
		...state,
		response: {
			...state.response,
			body: foos,
			statusCode: 200
		}
	};
});
```

Using params:

``` javascript
const reducer = path('/api/foos/:fooId$',  async (state) => {
	const {fooId} = state.request.params;
	const foo = await findFoo(fooId);

	return {
		...state,
		response: {
			...state.response,
			body: foo,
			statusCode: foo ? 200 : 404
		}
	};
});
```


## method(method: string, ...reducers : AsyncReducerFunction[]) : AsyncReducerFunction

``` javascript
import {method} from 'jambon-router';

const methodReducer = method('POST', );



```