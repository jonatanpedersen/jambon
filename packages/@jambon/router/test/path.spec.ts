import 'mocha';
import {describeAsyncReducer, noop, pass, fail} from '@jambon/test-helpers';
import {expect} from 'chai';
import {path} from '../';

describe('path', () => {
	describeAsyncReducer({
		description: 'matching path without params',
		asyncReducer: path('foos', pass()),
		initialContext: {
			request: {
				method: 'GET',
				headers: {},
				url: '/foos'
			}
		},
		expectedAsyncReducer: pass()
	});

	describeAsyncReducer({
		description: 'non matching path without params',
		asyncReducer: path('foos', fail()),
		initialContext: {
			request: {
				method: 'GET',
				headers: {},
				url: '/bars'
			}
		},
		expectedAsyncReducer: noop()
	});

	describeAsyncReducer({
		description: 'matching path with params',
		asyncReducer: path('foos/:id', pass()),
		initialContext: {
			request: {
				method: 'GET',
				headers: {},
				url: '/foos/1'
			}
		},
		expectedAsyncReducer: pass()
	});

	describeAsyncReducer({
		description: 'matching path + path with param + path + exact path with param',
		asyncReducer: path('bars',
			path(':barId',
				path('foos',
					path(':fooId$', pass())
				)
			)
		),
		initialContext: {
			request: {
				method: 'GET',
				headers: {},
				url: '/bars/123/foos/456'
			}
		},
		expectedAsyncReducer: pass()
	});

	describeAsyncReducer({
		description: 'matching exact relative paths with params',
		asyncReducer: path('bars',
			path(':barId',
				path('foos',
					path(':fooId', pass()),
					path(':fooId$', fail())
				)
			)
		),
		initialContext: {
			request: {
				method: 'GET',
				headers: {},
				url: '/bars/123/foos/456/qux'
			}
		},
		expectedAsyncReducer: pass()
	});

	describeAsyncReducer({
		description: 'non matching path with params',
		asyncReducer: path('foos/:id', fail()),
		initialContext: {
			request: {
				method: 'GET',
				headers: {},
				url: '/bars'
			}
		},
		expectedAsyncReducer: noop()
	});

	describeAsyncReducer({
		description: 'matching path',
		asyncReducer: path('foos', pass()),
		initialContext: {
			request: {
				method: 'GET',
				headers: {},
				url: '/foos'
			}
		},
		expectedAsyncReducer: pass()
	});

	describeAsyncReducer({
		description: 'matching path + path',
		asyncReducer: path('foos', path('bars', pass())),
		initialContext: {
			request: {
				method: 'GET',
				headers: {},
				url: '/foos/bars'
			}
		},
		expectedAsyncReducer: pass()
	});

	describeAsyncReducer({
		description: 'matching path with trailing slash + path',
		asyncReducer: path('foos/', path('bars', pass())),
		initialContext: {
			request: {
				method: 'GET',
				headers: {},
				url: '/foos/bars'
			}
		},
		expectedAsyncReducer: pass()
	});

	describeAsyncReducer({
		description: 'matching exact path',
		asyncReducer: path('$', pass()),
		initialContext: {
			request: {
				method: 'GET',
				headers: {},
				url: '/'
			}
		},
		expectedAsyncReducer: pass()
	});

	describeAsyncReducer({
		description: 'matching path with trailing slash + path',
		asyncReducer: path('foos/bars/', path('123', pass())),
		initialContext: {
			request: {
				method: 'GET',
				headers: {},
				url: '/foos/bars/123'
			}
		},
		expectedAsyncReducer: pass()
	});

});

function debug (context) {
	console.info('context', JSON.stringify(context, null, 4));

	return context;
}