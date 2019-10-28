const Router = require('@koa/router');
const Mock = require('mockjs');
const Path = require('path');
const loadDir = require('./dir-resolver');


function Mocker(options = {}) {
  const { prefix = '' } = options;
  this.router = new Router();

  if(prefix && prefix.length > 0) {
    this.router.prefix(prefix);
  }
}

Mocker.prototype.mock = function(options = {}) {
  const { path, mock, method = 'GET', middlewares } = options;
  this.router.options(path, async function(ctx, next) {
    ctx.status = 200;
    await next();
  });
  
  this.router[method.toLowerCase()](path, async function(ctx, next) {
    if (typeof mock === 'function') {
      ctx.body = Mock.mock(mock(ctx));
    } else if (typeof mock === 'object') {
      ctx.body = Mock.mock(mock);
    }
    await next();
  });

  if (Array.isArray(middlewares) && middlewares.length > 0) {
    this.router.use(path, ...middlewares);
  }
};


Mocker.prototype.loadDir = function() {
  const assets = loadDir.apply(this, arguments);

  const resolveAssetList = (list) => {
    for(let asset of list) {
      if(Array.isArray(asset)) {
        resolveAssetList(asset);
      } else {
        this.mock(asset);
      }
    }
  }

  resolveAssetList(assets);
}


Mocker.prototype.routes = function() {
  return this.router.routes();
}


module.exports = Mocker;