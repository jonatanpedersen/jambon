import 'mocha';
import {describeAsyncReducer} from 'jambon-test-helpers';
import {expect} from 'chai';
import {jsonParseRequestBody, jsonStringifyResponseBody} from '../';

describeAsyncReducer({
	description: 'jsonParseRequestBody should parse request body',
	asyncReducer: jsonParseRequestBody,
	initialState: {
		request: {
			method: 'POST',
			headers: {},
			url: '/',
			body: '{"foo": 1, "bar": 2}'
		}
	},
	expectedFinalState: {
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


describeAsyncReducer({
	description: 'jsonStringifyResponseBody should stringify object response body',
	asyncReducer: jsonStringifyResponseBody,
	initialState: {
		request: {
			method: 'GET',
			headers: {},
			url: '/'
		},
		response: {
			headers: {
				'Content-Type': 'application/json'
			},
			body: {
				foo: 1,
				bar: 2
			}
		}
	},
	expectedFinalState: {
		request: {
			method: 'GET',
			headers: {},
			url: '/'
		},
		response: {
			headers: {
				'Content-Type': 'application/json'
			},
			body: '{"foo": 1, "bar": 2}'
		}
	}
});
