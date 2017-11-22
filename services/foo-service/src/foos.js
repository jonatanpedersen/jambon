import {path, get, post} from 'jambon-router';
import iterableCursor from './iterableCursor';

export default function (db) {
	const foos = db.collection('foos');

	return [
		path('/api/foos',
			post(createFoo),
			get(getFoos)
		),
		path('/api/foos/:id',
			get(findFoo)
		)
	];

	async function createFoo ({request, response}) {
		const foo = request.body;
		await foos.insertOne(foo);

		return {
			request,
			response: {
				...response,
				body: foo,
				statusCode: 201,
				statusMessage: 'Created Foo'
			}
		};
	}

	async function getFoos ({request, response}) {
		return {
			request,
			response: {
				...response,
				body: iterableCursor(foos.find()),
				statusCode: 200
			}
		};
	}

	async function findFoo ({request, response}) {
		const {id} = request.params;
		const foo = await foos.findOne({id});

		return {
			request,
			response: {
				...response,
				body: foo,
				statusCode: foo ? 200 : 404
			}
		};
	}
}
