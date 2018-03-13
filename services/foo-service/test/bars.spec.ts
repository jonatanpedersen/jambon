import 'mocha';
import {all} from '@jambon/core';
import {describeAsyncReducer, noop} from '@jambon/test-helpers';
import {expect} from 'chai';
import bars from '../src/bars';

describeAsyncReducer({
	description: 'GET /api/foos',
	asyncReducer: all(...bars()),
	initialContext: {
		request: {
			method: 'GET',
			headers: {},
			url: '/api/bars'
		}
	},
	expectedFinalContext: {
		request: {
			method: 'GET',
			headers: {},
			url: '/api/bars'
		},
		response: {
			statusCode: 200,
			body: [{
				"id": "1",
				"title": "Bar 1"
			},
			{
				"id": "2",
				"title": "Bar 2"
			}]
		}
	}
});

describeAsyncReducer({
	description: 'GET /api/foos/1',
	asyncReducer: all(...bars()),
	initialContext: {
		request: {
			method: 'GET',
			headers: {},
			url: '/api/bars/1'
		}
	},
	expectedFinalContext: {
		request: {
			method: 'GET',
			headers: {},
			url: '/api/bars/1'
		},
		response: {
			statusCode: 200,
			body: {
				"id": "1",
				"title": "Bar 1"
			}
		}
	}
});

describeAsyncReducer({
	description: 'GET /api/foos/2',
	asyncReducer: all(...bars()),
	initialContext: {
		request: {
			method: 'GET',
			headers: {},
			url: '/api/bars/2'
		}
	},
	expectedFinalContext: {
		request: {
			method: 'GET',
			headers: {},
			url: '/api/bars/2'
		},
		response: {
			statusCode: 200,
			body: {
				"id": "2",
				"title": "Bar 2"
			}
		}
	}
});

describeAsyncReducer({
	description: 'GET /api/foos/3',
	asyncReducer: all(...bars()),
	initialContext: {
		request: {
			method: 'GET',
			headers: {},
			url: '/api/bars/3'
		}
	},
	expectedFinalContext: {
		request: {
			method: 'GET',
			headers: {},
			url: '/api/bars/3'
		},
		response: {
			statusCode: 404,
			body: undefined
		}
	}
});
