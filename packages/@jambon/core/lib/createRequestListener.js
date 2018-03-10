"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const streamTostring = require("stream-to-string");
const all_1 = require("./reducers/all");
function createRequestListener(...reducers) {
    return requestListener;
    function requestListener(req, res) {
        handlerAsync(req, res).catch(err => {
            console.error(err);
            process.exit(1);
        });
    }
    async function handlerAsync(req, res) {
        const { headers, method, url } = req;
        const body = await streamTostring(req);
        const initialState = {
            request: {
                method,
                body,
                headers,
                url
            }
        };
        const finalState = await all_1.all(...reducers)(initialState);
        if (finalState.response) {
            if (finalState.response.headers) {
                for (let header in finalState.response.headers) {
                    res.setHeader(header, finalState.response.headers[header]);
                }
            }
            if (finalState.response.statusMessage) {
                res.statusMessage = finalState.response.statusMessage;
            }
            if (finalState.response.statusCode) {
                res.statusCode = finalState.response.statusCode;
            }
            if (finalState.response.body) {
                await forEach(finalState.response.body, str => {
                    res.write(str);
                });
            }
        }
        res.end();
    }
}
exports.createRequestListener = createRequestListener;
async function forEach(asyncIterator, fn) {
    const { value, done } = await asyncIterator.next();
    if (done === true) {
        return;
    }
    fn(value);
    await forEach(asyncIterator, fn);
}
exports.forEach = forEach;
async function* text(str) {
    yield str;
}
exports.text = text;
//# sourceMappingURL=createRequestListener.js.map