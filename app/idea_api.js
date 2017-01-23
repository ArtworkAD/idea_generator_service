// Load libraries
const app = require('../app.js');
const router = app.router;
const ideas = app.database.get('ideas');

// List all ideas
module.exports.list = async ctx => {
	ctx.body = await ideas.find({});
};

// Get specific idae
module.exports.get = async(ctx) => {
	ctx.body = await ideas.findOne({
		_id: ctx.params.id
	});
	if (!ctx.body) {
		ctx.throw(404);
	}
};
