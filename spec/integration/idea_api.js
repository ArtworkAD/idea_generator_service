var app = require('../../app.js');
var request = require('supertest').agent(app.app.listen());

describe('idea rest api test suit', function() {

	var nonExistentEntityId = '57f42072cb1564dc53a74806';

	it('should list ideas', function*() {
		yield request
			.get('/idea')
			.expect('Content-Type', /application\/json/)
			.expect(200);
	});

	it('should give 404 when entity to remove does not exist', function*() {
		yield request
			.delete('/idea/' + nonExistentEntityId)
			.expect(404);
	});

	it('should give 404 when entity to retrieve does not exist', function*() {
		yield request
			.get('/idea/' + nonExistentEntityId)
			.expect(404);
	});
});
