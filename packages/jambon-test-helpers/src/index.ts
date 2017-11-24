import {expect} from 'chai';
import 'mocha';
import {State, AsyncReducerFunction} from 'jambon-core';
import {diff} from 'deep-diff';

export interface AsyncReducerTest {
	only? : boolean
	skip? : boolean
	description : string
	asyncReducer : AsyncReducerFunction
	initialState : State
	expectedFinalState : State
}

export function noop () {
	return async function noop (state : State) : Promise<State> {
		return {
			...state,
			response: {
				statusCode: 200
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
		let actualFinalState;

		before(async () => {
			actualFinalState = await test.asyncReducer(test.initialState);
		});

		it('actual final state should deep equal expected final state', () => {
			expect(actualFinalState).to.deep.equal(test.expectedFinalState)
		})
	});
};
