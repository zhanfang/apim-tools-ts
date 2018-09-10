/**
 * @file 静态文件的处理器
 * @author zhanfang(fzhanxd@gmail.com)
 */

import * as Koa from 'koa';

/**
 * 处理 mock 管理客户端的静态资源请求
 *
 * @param {Object} context 请求上下文
 * @param {Function} next 下一个请求处理器
 * @return {*}
 */
function processMockManageStaticRequest(context: Koa.Context, next: any) {
    return next();
}

export default processMockManageStaticRequest;
