/**
 * @file ajax 管理的异步请求的处理器
 * @author zhanfang(fzhanxd@gmail.com)
 */

import * as Koa from 'koa';

/**
 * 处理 mock 管理客户端的 ajax 请求
 *
 * @param {Object} context 请求上下文
 * @param {Function} next 下一个请求处理器
 * @return {*}
 */
async function processAjaxRequest(context: any, next: any) {
    const reqPathName = context.pathname;
    context.logger.debug('process mock manage ajax request', reqPathName);
}

export default processAjaxRequest;
