import {path, get} from 'jambon-router';
import {HttpState} from 'jambon-core';

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
		path('/api/bars$',
			get(getBars)
		),
		path('/api/bars/:id',
			get(findBar)
		)
	];

	async function getBars (state : HttpState) : Promise<HttpState> {
		return {
			...state,
			response: {
				...state.response,
				body: bars,
				statusCode: 200
			}
		};
	}

	async function findBar (state : HttpState) : Promise<HttpState> {
		const {id} = state.request.params;
		const bar = bars.find(bar => bar.id === id);

		return {
			...state,
			response: {
				...state.response,
				body: bar,
				statusCode: bar ? 200 : 404
			}
		};
	}
}
