import 'mocha';
import {describeAsyncReducer} from '@jambon/test-helpers';
import {expect} from 'chai';
import {jsonParseRequestBody, jsonStringifyResponseBody} from '../';

describeAsyncReducer({
	description: 'jsonParseRequestBody should parse request body',
	asyncReducer: jsonParseRequestBody,
	initialContext: {
		request: {
			method: 'POST',
			headers: {},
			url: '/',
			body: '{"foo": 1, "bar": 2}'
		}
	},
	expectedFinalContext: {
		request: {
			method: 'POST',
			headers: {},
			url: '/',
			body: {
				foo: 1,
				bar: 2
			}
		}
	}
});
