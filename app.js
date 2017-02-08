// Load environment variables
require('dotenv')
  .config();

// Load libraries
const koa = require('koa');
const logger = require('koa-logger');
const body = require('koa-bodyparser');
const error = require('koa-json-error');
const cors = require('kcors');

// Setup
const router = module.exports.router = require('koa-router')();
const database = module.exports.database = require('monk')(process.env.DB_HOST + '/' + process.env.DB_NAME); <<

// Load api
const component_api = require('./app/service/component_api.js');
const generator_api = require('./app/service/generator_api.js');
const idea_api = require('./app/api/idea_api.js');

const app = module.exports.app = new koa();

// Setup app's middleware
app
  .use(error({
    format: err => {
      return {
        status: err.status,
        message: err.message
      }
    }
  }))
  .use(cors())
  .use(body())
  .use(logger())
  .use(router.routes())
  .use(router.allowedMethods());

router
  // Component routes
  .get('component.list', '/component', component_api.list)
  .get('component.get', '/component/:id', component_api.get)
  .post('component.create', '/component', component_api.create)
  .put('component.update', '/component/:id', component_api.update)
  .delete('component.delete', '/component/:id', component_api.delete)
  // Idea routes
  .get('idea.list', '/idea', idea_api.list)
  .get('idea.get', '/idea/:id', idea_api.get)
  // Generator routes
  .post('generator.random', '/generator/random', generator_api.random)
  .get('generator.evaluated', '/generator/evaluated', generator_api.evaluated)
  .get('generator.predictRandom', '/predict-random', generator_api.predictRandom);

app.listen(process.env.PORT || 3000);
