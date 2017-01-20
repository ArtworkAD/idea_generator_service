describe('generator_random schema test suit', function() {
	const generator_random = require('../../app/schema').generator_random;

	it('should be an object', function*() {
		expect(generator_random.type).toBe('object');
	});

	it('should require product, number_of_ideas and number_of_components_per_idea to exist', function*() {
		expect(generator_random.required).toContain('product');
		expect(generator_random.required).toContain('number_of_ideas');
		expect(generator_random.required).toContain('number_of_components_per_idea');
	});

	it('should have properties', function*() {
		expect(generator_random.properties).not.toBeUndefined();
	});

	it('should have a product of type string', function*() {
		expect(generator_random.properties.product).not.toBeUndefined();
		expect(generator_random.properties.product.type).toBe('string');
	});

	it('should have number_of_ideas of type number', function*() {
		expect(generator_random.properties.number_of_ideas).not.toBeUndefined();
		expect(generator_random.properties.number_of_ideas.type).toBe('number');
	});

	it('should have number_of_components_per_idea of type number', function*() {
		expect(generator_random.properties.number_of_components_per_idea).not.toBeUndefined();
		expect(generator_random.properties.number_of_components_per_idea.type).toBe('number');
	});

	it('should require product to be at least 3 characters in length', function*() {
		expect(generator_random.properties.product.minLength).toEqual(3);
	});

	it('should not allow additional properties', function*() {
		expect(generator_random.additionalProperties).toBeFalsy();
	});
});
