// Load libraries
const _ = require('lodash');
const jsonexport = require('jsonexport');
const app = require('../app.js');
const schema = require('./schema');
const Azure = require('./azure_api');
const components = app.database.get('components');
const ideas = app.database.get('ideas');

// Setuo validator
const validator = require("ajv")({
  removeAdditional: true
});
validator.addSchema(schema.generator_random, 'generator_random');

/**
 * Generates random ideas and stores them in database.
 * Responds with the ideas afterwards.
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

/**
 * This should be called when a batch of ideas was evaluated.
 * As a result all evaluated ideas will be uploaded to a cloud
 * storage provider for the machine learning process.
 */
module.exports.evaluated = async ctx => {
  var i = await ideas.find({
    evaluation: {
      $exists: true
    }
  });
  console.log(i);
  i.forEach(idea => {
    idea._id = idea._id.toString();
  });
  jsonexport(i, function (err, csv) {
    if (err) {
      ctx.throw(422, err);
    } else {
      ctx.body = Azure.uploadIdeasAsCSV(csv);
    }
  });
};
