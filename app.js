// Load environment variables
require('dotenv').config();

// Load libraries
const koa = require('koa');
const logger = require('koa-logger');
const body = require('koa-bodyparser');
const error = require('koa-json-error');
const cors = require('kcors');
const util = require('./app/util.js');

// Router singleton
const router = module.exports.router = require('koa-router')();

// Setup database singleton
const database = module.exports.database = require('monk')(process.env.DB_HOST + '/' + process.env.DB_NAME);

// Load api
const component_api = require('./app/component_api.js');
const generator_api = require('./app/generator_api.js');

// Create app
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
	.post('generator.random', '/generator/random', generator_api.random)
	// Top level routes
	.get('/', (ctx, next) => {
		ctx.body = {
			component_url: util.toAbsoluteUrl(ctx, router.url('component.list')),
			generator_random_url: util.toAbsoluteUrl(ctx, router.url('generator.random'))
		};
	});

app.listen(process.env.PORT || 3000);
