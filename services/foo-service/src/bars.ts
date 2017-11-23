import {path, get} from 'jambon-router';

const bars = [
	{
		"id": "1",
		"title": "Bar 1"
	},
	{
		"id": "2",
		"title": "Bar 2"
	}
];

export default function () {
	return [
		path('/api/bars',
			get(getBars)
		),
		path('/api/bars/:id',
			get(findBar)
		)
	];

	async function getBars ({request, response}) {
		return {
			request,
			response: {
				...response,
				body: bars,
				statusCode: 200
			}
		};
	}

	async function findBar ({request, response}) {
		const {id} = request.params;
		const bar = bars.find(bar => bar.id === id);

		return {
			request,
			response: {
				...response,
				body: bar,
				statusCode: bar ? 200 : 404
			}
		};
	}
}
