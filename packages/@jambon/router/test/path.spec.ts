import 'mocha';
import {describeAsyncReducer, noop, pass, fail} from '@jambon/test-helpers';
import {expect} from 'chai';
import {path} from '../';

describe('path', () => {
	describeAsyncReducer({
		description: 'matching path without params',
		asyncReducer: path('/foos', pass()),
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
		asyncReducer: path('/foos', fail()),
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
		asyncReducer: path('/foos/:id', pass()),
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
		only: true,
		description: 'matching relative paths with params',
		asyncReducer: path('foos', path(':fooId', path('bars', path(':barId', pass())))),
		initialContext: {
			request: {
				method: 'GET',
				headers: {},
				url: '/foos/1/bars/2'
			}
		},
		expectedAsyncReducer: pass()
	});

	describeAsyncReducer({
		description: 'non matching path with params',
		asyncReducer: path('/foos/:id', fail()),
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
		description: 'matching absolute path',
		asyncReducer: path('/foos', pass()),
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
		description: 'non matching absolute path',
		asyncReducer: path('/foos', fail()),
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
		description: 'matching relative path',
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
		description: 'matching absolute path and matching relative path',
		asyncReducer: path('/foos', path('bars', pass())),
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
		description: 'matching relative path and matching relative path',
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
		description: 'matching absolute path and matching absolute path',
		asyncReducer: path('/foos', path('/foos/bars', pass())),
		initialContext: {
			request: {
				method: 'GET',
				headers: {},
				url: '/foos/bars'
			}
		},
		expectedAsyncReducer: pass()
	});
});