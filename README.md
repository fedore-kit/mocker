# @Fedore/Mocker

基于 Koa.js 与 Mock.js 的 JSON Mock 服务器

# 目录

<!-- TOC -->

- [@Fedore/Mocker](#fedoremocker)
- [目录](#目录)
- [使用指南](#使用指南)
  - [安装](#安装)
  - [完整的用例与参数说明](#完整的用例与参数说明)
    - [示例代码](#示例代码)
    - [构造函数参数说明](#构造函数参数说明)
    - [mock() 参数说明](#mock-参数说明)
  - [其他用例](#其他用例)
    - [使用回调定义接口](#使用回调定义接口)
    - [使用中间件](#使用中间件)
    - [从目录中导入接口定义](#从目录中导入接口定义)

<!-- /TOC -->

# 使用指南

## 安装

- 使用 npm
```
npm install --save koa @fedore/mocker
```

- 使用 yarn
```
yarn add koa @fedore/mocker
```


## 完整的用例与参数说明

### 示例代码

```js
const { Mocker } = require('@fedore/mocker');
const Koa = require('koa');

const mocker = new Mocker({
  prefix: '/api'
});

mocker.mock({
  path: '/demo',
  mock: {
    'list|10': [
      {
        'id|+1': 1,
        'name|+1': ['foo', 'bar', 'baz']
      }
    ]
  }
});

const app = new Koa();

app.use(mocker.routes());
app.listen(3000);

```

使用 node 运行上述 js 代码，并访问 `http://localhost:3000/api/demo` 即可查看效果


### 构造函数参数说明

|参数名|类型|默认值|必填|说明|
|:-|:-:|:-:|:-:|:-|
|prefix|string|空字符串|否|该实例所有mock接口前缀|


### mock() 参数说明

`mocker.mock()` 方法可以创建一个 mock 接口，以下是参数说明：

|参数名|类型|默认值|必填|说明|
|:-|:-:|:-:|:-:|:-|
|path|string||是|mock 接口路径|
|method|string|get|是|mock 接口的HTTP方法，不区分大小写|
|mock|Object 或 Function||是|mock 接口内容定义，或提供一个返回 Mock 定义的回调函数，具体格式请参照 [Mock.js 语法规范](https://github.com/nuysoft/Mock/wiki/Syntax-Specification)|
|middlewares|Array&lt;Function&gt;|[]|否|Koa 中间件数组，数组内的所有中间件仅对path参数指定的路径生效|


## 其他用例

### 使用回调定义接口

```js
mocker.mock({
  path: '/demo/:name',
  mock(ctx) {
    return {
      "message": `hello, ${ctx.params.name}`
    }
  }
});
```

```js
// http://localhost:3000/api/demo/bob

{
  "message": "hello, bob"
}
```



### 使用中间件

```js
mocker.mock({
  path: '/demo',
  mock: {
    "list|2": [{
      "id|+1": 1
    }]
  },
  middlewares: [
    async function(ctx, next) {
      await next();
      ctx.set('Access-Control-Allow-Origin', '*');
    }
  ]
});
```

```js
// Access-Control-Allow-Origin: *
// http://localhost:3000/api/demo

{
  "list": [
    {
      "id": 1
    },
    {
      "id": 2
    }
  ]
}
```



### 从目录中导入接口定义

- /index.js

```js
const { Mocker } = require('@fedore/mocker');
const Koa = require('koa');
const path = require('path');

const mocker = new Mocker({
  prefix: '/api'
});

mocker.loadDir(path.join(process.cwd(), 'mocks'));

const app = new Koa();

app.use(mocker.routes());
app.listen(3000);
```

- /mocks/demo.js

```js
module.exports = {
  path: '/demo',
  mock: {
    message: 'Hello World'
  }
}
```

- 浏览器
```js
// http://localhost:3000/api/demo

{
  "message": "Hello World"
}
```

- loadDir 参数说明

|参数位置|参数名|类型|默认值|必填|说明|
|:-:|:-|:-:|:-:|:-:|:-|
|1|path|string||是|目录路径|
|2|deep|boolean|true|否|是否遍历子文件夹|
|3|encoding|string|utf8|否|编码|