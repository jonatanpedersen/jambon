import {path, get, post} from 'jambon-router';
import {HttpState} from 'jambon-core';
import iterableCursor from './iterableCursor';

export default function ({db}) {
	const foos = db.collection('foos');

	return [
		path('/api/foos$', post(createFoo), get(getFoos)),
		path('/api/foos/:fooId$', get(findFoo))
	];

	async function createFoo (state : HttpState) : Promise<HttpState> {
		const foo = state.request.body;
		await foos.insertOne(foo);

		return {
			...state,
			response: {
				...state.response,
				body: foo,
				statusCode: 201,
				statusMessage: 'Created Foo'
			}
		};
	}

	async function getFoos (state : HttpState) : Promise<HttpState> {
		return {
			...state,
			response: {
				...state.response,
				body: iterableCursor(foos.find()),
				statusCode: 200
			}
		};
	}

	async function findFoo (state : HttpState) : Promise<HttpState> {
		const {fooId} = state.request.params;
		const foo = await foos.findOne({fooId});

		return {
			...state,
			response: {
				...state.response,
				body: foo,
				statusCode: foo ? 200 : 404
			}
		};
	}
}
