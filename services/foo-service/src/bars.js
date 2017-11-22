import {path, get} from 'jambon-router';

export default function () {
	const bars = [{
		id: '1',
		title: 'Bar 1'
	}];

	return [
		path('/api/bars',
			get(getBars)
		),
		path('/api/bars/:id',
			get(findBar)
		)
	];

	async function getBars ({request, response}) {
		const body = bars;
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

	async function findBar ({request, response}) {
		const id = request.params.id;
		const bar = bars.find(bar => bar.id === id);
		const body = bar;
		const statusCode = bar ? 200 : 404;

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