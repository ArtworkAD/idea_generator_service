// Load libraries
const app = require('../../app.js');
const schema = require('../share/schema');
const util = require('../share/util.js');
const router = app.router;
const components = app.database.get('components');

// Setup validator
const validator = require("ajv")({
  removeAdditional: true
});
validator.addSchema(schema.component, 'component');

// List all components
module.exports.list = async ctx => {
  ctx.body = await components.find({});
};

// Get specific component
module.exports.get = async(ctx) => {
  ctx.body = await components.findOne({
    _id: ctx.params.id
  });
  if (!ctx.body) {
    ctx.throw(404);
  }
};

// Create a component
module.exports.create = async ctx => {
  if (validator.validate('component', ctx.request.body)) {
    // If the component already exists provide url to existing ressource by setting proper header
    var component = await components.findOne({
      'name': ctx.request.body.name
    });
    if (component) {
      ctx.body = component;
      ctx.status = 303;
    } else {
      ctx.body = await components.insert(ctx.request.body);
      ctx.status = 201;
    }
    ctx.set('Location', util.toAbsoluteUrl(ctx, router.url('component.get', {
      id: ctx.body._id
    })));
  } else {
    ctx.throw(422, validator.errorsText());
  }
};

// Update component
module.exports.update = async ctx => {
  if (validator.validate('component', ctx.request.body)) {
    var result = await components.update(ctx.params.id, ctx.request.body);
    if (result.n === 0) {
      ctx.throw(404);
    } else {
      ctx.status = 200;
      ctx.request.body._id = ctx.params.id;
      ctx.body = ctx.request.body;
    }
  } else {
    ctx.throw(422, validator.errorsText());
  }
};

// Delete component
module.exports.delete = async ctx => {
  var r = await components.remove(ctx.params.id);
  if (r.result.n === 0) {
    ctx.throw(404);
  } else {
    ctx.status = 204;
  }
};
