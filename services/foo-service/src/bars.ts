import {path, get} from '@jambon/router';
import {HttpContext} from '@jambon/core';

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
		path('bars$',
			get(getBars)
		),
		path('bars/:id',
			get(findBar)
		)
	];

	async function getBars (context : HttpContext) : Promise<HttpContext> {
		return {
			...context,
			response: {
				...context.response,
				body: bars,
				statusCode: 200
			}
		};
	}

	async function findBar (context : HttpContext) : Promise<HttpContext> {
		const {id} = context.router.params;
		const bar = bars.find(bar => bar.id === id);

		return {
			...context,
			response: {
				...context.response,
				body: bar,
				statusCode: bar ? 200 : 404
			}
		};
	}
}
