/**
 * @file 测试入口
 * @author zhanfang(fzhanxd@gmail.com)
 */
'use strict';

const Koa = require('koa');
const apim = require('../dist/index').default;

const app = new Koa();
const port = 9090;

const apimMiddleware = apim({
    port,
    logLevel: 'debug',
    root: __dirname + '/mock',
    mockRules: [
        {
            match: '/api/getUserInfo2',
            method: ['get'],
        },
    ],
});

app.use(apimMiddleware);
app.use(async ctx => {
    ctx.body = 'Hello World';
});

app.listen(port);
