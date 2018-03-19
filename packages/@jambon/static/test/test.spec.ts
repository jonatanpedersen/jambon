import 'mocha';
import { describeAsyncReducer } from '@jambon/test-helpers';
import { expect } from 'chai';
import { dir } from '../';

describe('static', () => {
	describeAsyncReducer({
		skip: true,
		description: 'dir should respond',
		asyncReducer: dir('test/public'),
		initialContext: {
			request: {
				method: 'GET',
				headers: {},
				url: '/index.html',

			}
		},
		expectedFinalContext: {
			request: {
				method: 'GET',
				headers: {},
				url: '/index.html',

			},
			response: {
				headers: {},
				body: '<html><body>Hello World</body></html>'
			}
		}
	});
});
