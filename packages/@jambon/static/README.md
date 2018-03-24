# @jambon/static

## Install

``` bash
npm i @jambon/static
```

## Usage

public/index.html:

``` html
<html><body>Hello World</body></html>
```

index.js:

``` javascript
import { createRequestListener } from '@jambon/core';
import { pugFile } from '@jambon/pug';
import http from 'http';

const server = http.createServer(
    createRequestListener(
        dir('public')
    )
);

const port = process.env.PORT || 8000;

server.listen(port);
```

Test:

``` bash
node .
$ curl http://localhost:8000/ -s -i
HTTP/2 200
...
content-type: text/html
...

<html><body>Hello World</body></html>
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
