import 'mocha';
import {describeAsyncReducer, noop} from '@jambon/test-helpers';
import {expect} from 'chai';
import {method, get, put, post, patch, del} from '../';

describeAsyncReducer({
	description: 'matching method',
	asyncReducer: method('POST', noop()),
	initialState: {
		request: {
			method: 'POST',
			headers: {},
			url: '/foos'
		}
	},
	expectedFinalState: {
		request: {
			method: 'POST',
			headers: {},
			url: '/foos'
		},
		response: {
			statusCode: 200
		}
	}
});

describeAsyncReducer({
	description: 'non matching method',
	asyncReducer: method('POST', noop()),
	initialState: {
		request: {
			method: 'GET',
			headers: {},
			url: '/foos'
		}
	},
	expectedFinalState: {
		request: {
			method: 'GET',
			headers: {},
			url: '/foos'
		}
	}
});