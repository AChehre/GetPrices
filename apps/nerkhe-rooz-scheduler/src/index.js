const { getPrices, getAveragePrices } = require('../../get-prices/services/getPrices');

 const { routes } = require('../../shared/router/routes');
const { parseAssets } = require('../../shared/router/utils');

const handlers = {
	getPrices,
	getAveragePrices,
};

export default {
	async fetch(request, env, ctx) {
		// const assets1 = routes.needsAssets ? parseAssets(url.searchParams.get('assets')) : [];
		const prices = await getPrices();

		console.log(JSON.stringify(prices));
		
		// insert to db

		return new Response(JSON.stringify(prices), {
			headers: { 'Content-Type': 'application/json' },
		});
	},
};
