import bars from './bars';
import foos from './foos';
import {path, get, post, accept, contentType} from '@jambon/router';
import {jsonParseRequestBody, jsonStringifyResponseBody, setResponseContentTypeHeaderToApplicationJson, JSON_MIME_TYPE} from '@jambon/json';

export default function ({db}) {
	return path('/api',
		post(
			contentType(JSON_MIME_TYPE, jsonParseRequestBody)
		),
		...foos({db}),
		...bars(),
		path('/api/fail', async context => {
			throw new Error('fail');
		}),
		setResponseContentTypeHeaderToApplicationJson,
		jsonStringifyResponseBody
	);
}