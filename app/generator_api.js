// Load libraries
const _ = require('lodash');
const app = require('../app.js');
const schema = require('./schema');

const router = app.router;
const components = app.database.get('components');
const ideas = app.database.get('ideas');

/**
 * We use this module to validate inputs agains the json schema.
 * removeAdditional: true will remove all fields that are not specified in the schema.
 */
const validator = require("ajv")({
	removeAdditional: true
});

// Load schema
validator.addSchema(schema.generator_random, 'generator_random');

/**
 * Generates random ideas.
 * @param {String} product name
 * @param {Number} number_of_ideas number of ideas
 * @param {Number} number_of_components_per_idea number of components per idea
 * @return {Response} json created ideas
 */
module.exports.random = async ctx => {
	if (validator.validate('generator_random', ctx.request.body)) {

		const params = ctx.request.body;
		const list = await components.find({});
		ctx.body = [];

		for (var i = 0; i < params.number_of_ideas; i++) {
			var idea = {
				product: params.product
			};

			list.forEach(component => {
				idea[component.name] = _.sampleSize(component.values, params.number_of_components_per_idea);
			});

			idea = await ideas.insert(idea);
			ctx.body.push(idea);
		}
	} else {
		ctx.throw(422, validator.errorsText());
	}
};
