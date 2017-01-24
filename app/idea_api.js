// Load libraries
const app = require('../app.js');
const ideas = app.database.get('ideas');

// List all ideas by product name or evaluation status.
module.exports.list = async ctx => {
  var query = {};
  if (ctx.query.evaluated) {
    query.evaluation = {
      $exists: true
    };
  }
  if (ctx.query.product) {
    query.product = ctx.query.product;
  }
  ctx.body = await ideas.find(query);
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
