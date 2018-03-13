import { expect } from 'chai';
import 'mocha';
import {HttpContext, AsyncReducerFunction} from '@jambon/core';

export interface AsyncReducerTest {
	only? : boolean
	skip? : boolean
	description : string
	asyncReducer : AsyncReducerFunction
	initialContext : HttpContext
	expectedFinalContext? : HttpContext,
	expectedAsyncReducer? : AsyncReducerFunction
}

export function noop () {
	return async function noop (context : HttpContext) : Promise<HttpContext> {
		return context;
	}
}

export function fail () {
	return async function fail (context : HttpContext) : Promise<HttpContext> {
		return {
			...context,
			test: {
				failed: true
			}
		};
	}
}

export function pass () {
	return async function pass (context : HttpContext) : Promise<HttpContext> {
		return {
			...context,
			test: {
				passed: true
			}
		};
	}
}

export function describeAsyncReducer (...tests : AsyncReducerTest[]) {
	tests.forEach(test => describeAsyncReducerTest(test));
}

export function describeAsyncReducerTest (test : AsyncReducerTest) {
	let describeFunction : Function = describe;

	if (test.only) {
		describeFunction = describe.only;
	}

	if (test.skip) {
		describeFunction = describe.skip;
	}

	describeFunction(test.description, () => {
		let actualFinalContext, expectedFinalContext;

		before(async () => {
			actualFinalContext = await test.asyncReducer(test.initialContext);
		});

		before(async () => {
			if (test.expectedAsyncReducer) {
				expectedFinalContext = await test.expectedAsyncReducer(test.initialContext);
			} else {
				expectedFinalContext = test.expectedFinalContext;
			}
		});

		it('actual final context should deep equal expected final context', () => {
			expect(actualFinalContext).to.deep.include(expectedFinalContext)
		})
	});
};
