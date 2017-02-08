// Load libraries
const _ = require('lodash');
const app = require('../../app.js');
const components = app.database.get('components');

module.exports = {
  /**
   * Generate unevaluated ideas randomly.
   * @param {String} product name
   * @param {Number} number_of_ideas
   * @param {Number} number_of_components_per_idea
   * @return {Array} list of ideas
   */
  async generateRandomIdeas(product, number_of_ideas, number_of_components_per_idea) {
    var ideas = [];
    const list = await components.find({});
    for (var i = 0; i < number_of_ideas; i++) {
      var idea = {
        product: product
      };
      list.forEach(component => {
        idea[component.name] = _.sampleSize(component.values, number_of_components_per_idea);
      });
      ideas.push(idea);
    }
    return ideas;
  },
  /**
   * Normalizes arrays inside the idea to strings.
   * @param {JSON} idea
   * @return {JSON} idea
   */
  normalizeIdea(idea) {
    _.forIn(idea, function (value, key) {
      if (Array.isArray(value)) {
        idea[key] = value.join(';');
      }
    });
    return idea;
  }
};
