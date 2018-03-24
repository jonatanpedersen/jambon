import 'mocha';
import { describeAsyncReducer } from '@jambon/test-helpers';
import { expect } from 'chai';
import { pugFile } from '../';

describe('@jambon/pug', () => {
	describe('pugFile', () => {
		describeAsyncReducer({
			description: 'should render pug with context as locals',
			asyncReducer: pugFile('test/test.pug'),
			initialContext: {
				request: {
					method: 'GET',
					headers: {},
					url: '/'
				},
				subject: 'World'
			},
			expectedFinalContext: {
				request: {
					method: 'GET',
					headers: {},
					url: '/'
				},
				response: {
					body: '<html><body>Hello World</body></html>'
				},
				subject: 'World'
			}
		});
});
});
