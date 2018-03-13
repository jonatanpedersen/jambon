import {path, get, post} from '@jambon/router';
import {HttpContext} from '@jambon/core';
import iterableCursor from './iterableCursor';

export default function ({db}) {
	const foos = db.collection('foos');

	return [
		path('/api/foos$', post(createFoo), get(getFoos)),
		path('/api/foos/:fooId$', get(findFoo))
	];

	async function createFoo (context : HttpContext) : Promise<HttpContext> {
		const foo = context.request.body;
		await foos.insertOne(foo);

		return {
			...context,
			response: {
				...context.response,
				body: foo,
				statusCode: 201,
				statusMessage: 'Created Foo'
			}
		};
	}

	async function getFoos (context : HttpContext) : Promise<HttpContext> {
		return {
			...context,
			response: {
				...context.response,
				body: iterableCursor(foos.find()),
				statusCode: 200
			}
		};
	}

	async function findFoo (context : HttpContext) : Promise<HttpContext> {
		const {fooId} = context.request.params;
		const foo = await foos.findOne({fooId});

		return {
			...context,
			response: {
				...context.response,
				body: foo,
				statusCode: foo ? 200 : 404
			}
		};
	}
}
