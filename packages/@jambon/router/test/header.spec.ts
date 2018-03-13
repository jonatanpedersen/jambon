import 'mocha';
import { describeAsyncReducer, noop, pass, fail } from '@jambon/test-helpers';
import { expect } from 'chai';
import { header } from '../';

describe('header', () => {
	describeAsyncReducer({
		description: 'matching header',
		asyncReducer: header('accept', 'text/html', pass()),
		initialContext: {
			request: {
				method: 'GET',
				headers: {
					'accept': 'text/html'
				},
				url: '/'
			}
		},
		expectedAsyncReducer: pass()
	});

	describeAsyncReducer({
		description: 'non matching header',
		asyncReducer: header('accept', 'text/xml', pass()),
		initialContext: {
			request: {
				method: 'GET',
				headers: {
					'accept': 'text/xml'
				},
				url: '/'
			}
		},
		expectedAsyncReducer: noop()
	});
});