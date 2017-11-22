import {path, get, post} from 'jambon-router';

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

		const body = foo;
		const statusCode = 201;
		const statusMessage = 'Created Foo';

		return {
			request,
			response: {
				...response,
				body,
				statusCode,
				statusMessage
			}
		};
	}

	async function getFoos ({request, response}) {
		const body = iterableCursor(foos.find());
		const statusCode = 200;

		return {
			request,
			response: {
				...response,
				body,
				statusCode
			}
		};
	}

	async function findFoo ({request, response}) {
		const {id} = request.params;
		const foo = await foos.findOne({id});

		const body = foo;
		const statusCode = foo ? 200 : 404;

		return {
			request,
			response: {
				...response,
				body,
				statusCode
			}
		};
	}
}

async function* iterableCursor(cursor) {
	try {
		while (await cursor.hasNext()) {
			yield await cursor.next();
		}
	} finally {
		await cursor.close();
	}
}