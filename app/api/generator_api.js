// Load libraries
const app = require('../../app.js');
const schema = require('../share/schema');
const ideas = app.database.get('ideas');
const MachineLearningService = require('../service/machine_learning_service');
const GeneratorService = require('../service/generator_service');

// Setuo validator
const validator = require("ajv")({
  removeAdditional: true
});
validator.addSchema(schema.generator_random, 'generator_random');

/**
 * Creates random ideas, saves them in database and returns the ideas.
 */
module.exports.random = async ctx => {
  if (validator.validate('generator_random', ctx.request.body)) {
    const params = ctx.request.body;
    const storedIdeas = [];

    // Create fresh and random ideas
    const randomIdeas = await GeneratorService.generateRandomIdeas(params.product, params.number_of_ideas, params.number_of_components_per_idea);

    // Store the ideas in database
    for (idea of randomIdeas) {
      const i = await ideas.insert(idea);
      storedIdeas.push(i);
    }
    ctx.body = storedIdeas;
  } else {
    ctx.throw(422, validator.errorsText());
  }
};

/**
 * This should be called when a batch of ideas was evaluated. As a result we can invoke
 * some procedures to work with the evaluation. In the current implementation
 * we just store the evaluated ideas in the azure cloud for the ML process.
 */
module.exports.evaluated = async ctx => {
  ctx.body = await MachineLearningService.uploadUnevaluatedIdeasToAzureCloud();
};

// Get random idea and predict evaluation
module.exports.predictRandom = async(ctx) => {
  const product = ctx.query.product || 'Perfum';
  const number_of_components_per_idea = ctx.query.number_of_components_per_idea || 1;

  // Generate and normalize idea
  const randomIdea = await GeneratorService.generateRandomIdeas(product, 1, number_of_components_per_idea);

  // Predict
  ctx.body = await MachineLearningService.predictEvaluationForSingleIdea(GeneratorService.normalizeIdea(randomIdea[0]));
};
