// Load libraries
const app = require('../app.js');
const router = app.router;
const ideas = app.database.get('components');

// List all components
module.exports.list = async ctx => {
	ctx.body = await ideas.find({});
};

// Get specific component
module.exports.get = async(ctx) => {
	ctx.body = await ideas.findOne({
		_id: ctx.params.id
	});
	if (!ctx.body) {
		ctx.throw(404);
	}
};
