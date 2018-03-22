const { path, get } = require('@jambon/router');
const { HttpContext } = require('@jambon/core');

module.exports = { bars };

function bars () {
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

	return [
		path('bars$',
			get(getBars)
		),
		path('bars/:id',
			get(findBar)
		)
	];

	async function getBars(context) {
		return {
			...context,
			response: {
				...context.response,
				body: bars,
				statusCode: 200
			}
		};
	}

	async function findBar(context) {
		const { id } = context.router.params;
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
