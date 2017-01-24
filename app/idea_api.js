// Load libraries
const jsonexport = require('jsonexport');
const app = require('../app.js');
const router = app.router;
const ideas = app.database.get('ideas');

// List all ideas
module.exports.list = async ctx => {
	var query = {};

	if (ctx.query.evaluated && ctx.query.product) {
		query = {
			product: ctx.query.product,
			evaluation: {
				$exists: true
			}
		};
	}

	var i = await ideas.find(query);

	if (ctx.headers.accept === 'text/csv' || ctx.query.format === 'text/csv') {
		// Convert _id from ObjectId to String
		i.forEach(idea => {
			idea._id = idea._id.toString();
		});
		jsonexport(i, function(err, csv) {
			if (err) {
				ctx.throw(422, err);
			} else {
				ctx.body = csv;
			}
		});
	} else {
		ctx.body = i;
	}
};

// Get specific idea
module.exports.get = async(ctx) => {
	ctx.body = await ideas.findOne({
		_id: ctx.params.id
	});
	if (!ctx.body) {
		ctx.throw(404);
	}
};
