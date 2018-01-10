import {expect} from 'chai';
import 'mocha';
import {HttpState, AsyncReducerFunction} from 'jambon';

export interface AsyncReducerTest {
	only? : boolean
	skip? : boolean
	description : string
	asyncReducer : AsyncReducerFunction
	initialState : HttpState
	expectedFinalState : HttpState
}

export function noop () {
	return async function noop (state : HttpState) : Promise<HttpState> {
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
