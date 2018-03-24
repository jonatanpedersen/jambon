import 'mocha';
import { describeAsyncReducer } from '@jambon/test-helpers';
import { expect } from 'chai';
import { setAccessControlResponseHeaders } from '../';

describe('@jambon/cors', () => {
	describe('setAccessControlResponseHeaders', () => {
		describeAsyncReducer({
			description: 'should set access control response headers',
			asyncReducer: setAccessControlResponseHeaders,
			initialContext: {
				request: {
					method: 'GET',
					headers: {},
					url: '/',

				}
			},
			expectedFinalContext: {
				request: {
					method: 'GET',
					headers: {},
					url: '/',

				},
				response: {
					headers: {
						'Access-Control-Allow-Credentials': 'true',
						'Access-Control-Allow-Headers': '*',
						'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
						'Access-Control-Allow-Origin': '*'
					}
				}
			}
		});

		describeAsyncReducer({
			description: 'should set allow origin access control response header to origin request header',
			asyncReducer: setAccessControlResponseHeaders,
			initialContext: {
				request: {
					method: 'GET',
					headers: {
						origin: 'https://jambon.io/'
					},
					url: '/',

				}
			},
			expectedFinalContext: {
				request: {
					method: 'GET',
					headers: {
						origin: 'https://jambon.io/'
					},
					url: '/',

				},
				response: {
					headers: {
						'Access-Control-Allow-Credentials': 'true',
						'Access-Control-Allow-Headers': '*',
						'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
						'Access-Control-Allow-Origin': 'https://jambon.io/'
					}
				}
			}
		});
	});
});
