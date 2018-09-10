/**
 * @file 请求匹配器
 * @author sparklewhy@gmail.com
 */

import url from 'url';
import path2regexp from 'path-to-regexp';

/**
 * 判断当前请求的接口是否匹配当前给定的接口
 *
 * @param {Object} condition 匹配查询条件
 * @param {string} condition.pathname 请求路径名
 * @param {string} condition.method 请求方法
 * @param {Object} condition.query 请求的查询参数
 * @param {boolean=} condition.isPageVisit 是否是页面访问
 * @param {Object} api 要匹配的接口定义
 * @return {boolean}
 */
export const match = (condition, api) => {
    let apiPath = api.path;
    if (!apiPath) {
        return false;
    }

    let apiMethod = api.method;
    let cacheKey = getInterfaceCacheKey(apiPath, apiMethod);
    let routerRule = _cacheCompileRouter[cacheKey];
    if (!routerRule) {
        routerRule = _cacheCompileRouter[cacheKey] = parseRouterRule(
            apiPath, apiMethod
        );
    }

    return routerRule.match(condition);
};
