/**
 * @file mock 请求处理器
 * @author zhanfang(fzhanxd@gmail.com)
 */

import {isPageVisit} from '../util';

/**
 * 处理 mock 请求
 *
 * @param {Object} context 请求上下文
 * @param {?Object} options 自定义选项
 * @param {Function=} next 下一个请求处理器
 * @return {Promise}
 */
function processMockRequest(context: any, options: any, next: any) {
    const mockManager = context.mockManager;
    const mockConfig = mockManager.getMockConfig();

    // 查找匹配的接口定义
    const foundMatchApi = mockManager.findMatchApiSchema(
        context.pathname,
        context.method,
        context.query,
        isPageVisit(context.req)
    );

    options || (options = {});

    // 请求参数的校验 和 获取响应数据响应
    return validateRequest(context, foundMatchApi, mockConfig).then(
        res => {
            if (res) {
                let result = doRequestMock(
                    foundMatchApi, context, options
                );

                if (result === false) {
                    // 判断是否存在自定义 mock
                    result = processCustomMock(context, options);
                    if (result === false) {
                        return next && next();
                    }
                }

                return result;
            }
            return res;
        }
    ).catch(err => {
        context.logger.error(
            'get request mock response data fail:',
            err.stack || err.toString()
        );

        let res = context.res;
        res.writeHead(500);
        res.end();
    });
}

export default processMockRequest;
