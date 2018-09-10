/**
 * @file 入口文件
 * @author zhanfang <fzhanxd@gmail.com>
 */
import chalk from 'chalk';
import urlUtil from 'url';
import * as Koa from 'koa';
import {getLogger} from './helper/log';
import ajaxHandler from './middlewares/ajax-hanlder';
import mockHandler from './middlewares/mock-handler';
import staticHandler from './middlewares/static-handler';

interface IMockRule {
    match: string,
    method?: string[],
    proxy?: string
}

interface IApimOptions {
    port?: number,
    root?: string,
    logger?: object,
    logLevel?: string,
    logPrefix?: string,
    clientRequestPrefix?: string,
    mockRules?: IMockRule[]
}

/**
 * 获取请求上下文
 *
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 * @return {Object}
 */
function getRequestContext(req: Koa.Request, res: Koa.Response) {
    return {
        ...getRequestBasicInfo(req.method, req.url),
        req,
        res,
        host: req.headers.host
    };
}

/**
 * 获取请求基本信息
 *
 * @param {string} method 请求方法
 * @param {string} url 请求 url
 * @return {Object}
 */
function getRequestBasicInfo(method:string, url:string) {
    const reqURL = urlUtil.parse(url, true);
    const reqMethod = method.toLowerCase();

    return {
        method: reqMethod,
        query: reqURL.query,
        pathname: reqURL.pathname,
        path: reqURL.path,
        url: reqURL
    };
}

function initLogger(options: IApimOptions) {
    return getLogger({
        level: options.logLevel,
        prefix: options.logPrefix || chalk.yellow("[APIM]")
    });
}

function initMockManager(options: IApimOptions) {
    MockManager.getInstance(schemaManager, {
        root: options.root,
        confPath: options.confPath
    });
}

export default (options: IApimOptions = {}) => {
    const logger = initLogger(options);
    const mockManager = initMockManager(options);
    console.log(logger);

    return async(ctx: Koa.Context, next: any) => {
        const {request: req, response: res} = ctx;
        const context = {...getRequestContext(req, res), logger};
    
        const reqHandlers = [ajaxHandler, staticHandler, mockHandler];
    
        const reqHandlerNum = reqHandlers.length;
        let currHandleIdx = -1;
        const nextHandler = function() {
            currHandleIdx++;
            if (currHandleIdx < reqHandlerNum) {
                const handler = reqHandlers[currHandleIdx];
                handler.call(this, context, nextHandler);
            } else {
                next();
            }
        };
    
        logger.debug('process request', context.method, context.path);
        nextHandler();
    };
};