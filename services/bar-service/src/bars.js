const { path, get } = require('@jambon/router');
const { HttpState } = require('@jambon/core');

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
		path('/api/bars$',
			get(getBars)
		),
		path('/api/bars/:id',
			get(findBar)
		)
	];

	async function getBars(state) {
		return {
			...state,
			response: {
				...state.response,
				body: bars,
				statusCode: 200
			}
		};
	}

	async function findBar(state) {
		const { id } = state.request.params;
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
