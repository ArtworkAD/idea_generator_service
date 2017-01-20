var app = require('../../app.js');
var request = require('supertest').agent(app.app.listen());

describe('generator rest api test suit', function() {

	it('should not generate if parameters do not match schema', function*() {
		yield request
			.post('/generator/random')
			.type('form')
			.send({})
			.set('Accept', /application\/json/)
			.expect(422);
	});

	it('should generate 10 ideas', function*() {

    const params = {
      product: 'Foobar',
      number_of_ideas: 10,
      number_of_components_per_idea: 2
    };

		const ideas = yield request
			.post('/generator/random')
			.type('json')
			.send(params)
			.set('Accept', /application\/json/)
			.expect('Content-Type', /application\/json/)
			.expect(200);

		expect(ideas.body.length).toBe(10);
	});
});
