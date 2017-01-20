var app = require('../../app.js');
var request = require('supertest').agent(app.app.listen());

describe('component rest api test suit', function() {

	var nonExistentEntityId = '57f42072cb1564dc53a74806';
	var componentRequest;
	var component;

	beforeEach(function*() {

		component = {
			name: 'Some component',
			values: [
				'Pay by use'
			]
		};

		componentRequest = yield request
			.post('/component')
			.type('form')
			.send(component)
			.set('Accept', /application\/json/)
			.expect('Content-Type', /application\/json/)
			.expect(201);

		component._id = componentRequest.body._id;
		expect(componentRequest.body).toEqual(component);
	});

	afterEach(function*() {
		yield request.delete('/component/' + componentRequest.body._id);
	});

	it('should list components', function*() {
		yield request
			.get('/component')
			.expect('Content-Type', /application\/json/)
			.expect(200);
	});

	it('should not create a component when it already exists, instead it should redirect', function*() {
		yield request
			.post('/component')
			.type('form')
			.send(component)
			.set('Accept', /application\/json/)
			.expect(303);
	});

	it('should not create a component that does not match schema', function*() {
		yield request
			.post('/component')
			.type('form')
			.send({})
			.set('Accept', /application\/json/)
			.expect(422);
	});

	it('should delete a component', function*() {
		yield request
			.delete('/component/' + componentRequest.body._id)
			.expect(204);
	});

	it('should give 404 when entity to remove does not exist', function*() {
		yield request
			.delete('/component/' + nonExistentEntityId)
			.expect(404);
	});

	it('should get a component as json', function*() {
		yield request
			.get('/component/' + componentRequest.body._id)
			.expect('Content-Type', /application\/json/)
			.expect(200);
	});

	it('should give 404 when entity to retrieve does not exist', function*() {
		yield request
			.get('/component/' + nonExistentEntityId)
			.expect(404);
	});

	it('should update a component', function*() {
		componentRequest.body.values = [
			"Vorwahlsystem: Zugang zur Ware mit freiwilligen Kontakt zum Personal",
			"Automatisierung / Selbstbedienung"
		];
		yield request
			.put('/component/' + componentRequest.body._id)
			.type('form')
			.send(componentRequest.body)
			.set('Accept', /application\/json/)
			.expect(200);
	});

	it('should not update a component that does not match schema', function*() {
		yield request
			.put('/component/' + componentRequest.body._id)
			.type('form')
			.send({})
			.set('Accept', /application\/json/)
			.expect(422);
	});

	it('should give 404 when entity to update does not exist', function*() {
		yield request
			.put('/component/' + nonExistentEntityId)
			.type('form')
			.send(componentRequest.body)
			.set('Accept', /application\/json/)
			.expect(404);
	})
});
