/**
 * @file ajax 管理的异步请求的处理器
 * @author zhanfang(fzhanxd@gmail.com)
 */

import mockHandler from '../mock';

export default (context: any, next: any) => {
    return mockHandler(context, null, next);
}
