// Schema for a business model component
module.exports.component = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 3
    },
    values: {
      type: 'array',
      minItems: 1,
    }
  },
  required: ['name', 'values'],
  additionalProperties: false
};
// Schema for parameters to be provided for random generator
module.exports.generator_random = {
  type: 'object',
  properties: {
    product: {
      type: 'string',
      minLength: 3,
    },
    number_of_ideas: {
      type: 'number'
    },
    number_of_components_per_idea: {
      type: 'number'
    }
  },
  required: ['product', 'number_of_ideas', 'number_of_components_per_idea'],
  additionalProperties: false
};
