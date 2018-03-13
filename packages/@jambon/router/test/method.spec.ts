import 'mocha';
import {describeAsyncReducer, noop, pass, fail} from '@jambon/test-helpers';
import {expect} from 'chai';
import {method, get, put, post, patch, del} from '../';

describe('method', () => {
	describeAsyncReducer({
		description: 'matching method',
		asyncReducer: method('POST', pass()),
		initialContext: {
			request: {
				method: 'POST',
				headers: {},
				url: '/foos'
			}
		},
		expectedAsyncReducer: pass()
	});

	describeAsyncReducer({
		description: 'non matching method',
		asyncReducer: method('POST', fail()),
		initialContext: {
			request: {
				method: 'GET',
				headers: {},
				url: '/foos'
			}
		},
		expectedAsyncReducer: noop()
	});
});