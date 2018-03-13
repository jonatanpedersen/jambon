# @jambon/router

``` bash
npm install @jambon/router
```

## API

### path

``` javascript
function path(path: string, ...reducers: (async context => context)[]) : async context => context
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
const reducer = path('/api/foos$', async (context) => {
    const foos = await getFoos();

    return {
        ...context,
        response: {
            ...context.response,
            body: foos,
            statusCode: 200
        }
    };
});
```

Using params:

``` javascript
const reducer = path('/api/foos/:fooId$',  async (context) => {
    const {fooId} = context.request.params;
    const foo = await findFoo(fooId);

    return {
        ...context,
        response: {
            ...context.response,
            body: foo,
            statusCode: foo ? 200 : 404
        }
    };
});
```

## Licence

The MIT License (MIT)

Copyright (c) 2018 [Jonatan Pedersen](https://www.jonatanpedersen.com/)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
