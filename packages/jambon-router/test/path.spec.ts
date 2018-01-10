import 'mocha';
import {describeAsyncReducer, noop} from 'jambon-test-helpers';
import {expect} from 'chai';
import {path} from '../';

describeAsyncReducer({
	description: 'matching path without params',
	asyncReducer: path('/foos', noop()),
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
			url: '/foos',
			params: {}
		},
		response: {
			statusCode: 200
		}
	}
});

describeAsyncReducer({
	description: 'non matching path without params',
	asyncReducer: path('/foos', noop()),
	initialState: {
		request: {
			method: 'GET',
			headers: {},
			url: '/bars'
		}
	},
	expectedFinalState: {
		request: {
			method: 'GET',
			headers: {},
			url: '/bars'
		}
	}
});

describeAsyncReducer({
	description: 'matching path with params',
	asyncReducer: path('/foos/:id', noop()),
	initialState: {
		request: {
			method: 'GET',
			headers: {},
			url: '/foos/1'
		}
	},
	expectedFinalState: {
		request: {
			method: 'GET',
			headers: {},
			url: '/foos/1',
			params: {
				id: '1'
			}
		},
		response: {
			statusCode: 200
		}
	}
});

describeAsyncReducer({
	description: 'non matching path with params',
	asyncReducer: path('/foos/:id', noop()),
	initialState: {
		request: {
			method: 'GET',
			headers: {},
			url: '/bars'
		}
	},
	expectedFinalState: {
		request: {
			method: 'GET',
			headers: {},
			url: '/bars'
		}
	}
});