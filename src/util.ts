/**
 * @file 工具方法
 * @author zhanfang(fzhanxd@gmail.com)
 */

import fs from 'fs';

/**
 * 获取给定的文件路径的状态信息
 *
 * @inner
 * @param {string} target 文件的目标路径
 * @return {?Object}
 */
function getFileState(target: string) {
    try {
        return fs.statSync(target);
    }
    catch (ex) {
        console.log(ex);
    }
}

/**
 * 判断当前请求是否是页面访问
 *
 * @param {Object} req 请求对象
 * @return {boolean}
 */
export const isPageVisit = (req: any) => {
    const accept = req.headers.accept;
    return accept && /(^|,)text\/html(,|$)/i.test(accept);
};

/**
 * 获取本机的 IPv4 地址
 *
 * @return {string}
 */
export const getIP = () => {
    const ifaces = require('os').networkInterfaces();
    const defultAddress = '127.0.0.1';
    let ip = defultAddress;

    function x(details: any) {
        if (ip === defultAddress && details.family === 'IPv4') {
            ip = details.address;
        }
    }

    Object.keys(ifaces).forEach(dev => {
        ifaces[dev].forEach(x);
    });

    return ip;
};

/**
 * 判断给定的文件路径是否存在
 *
 * @param {string} target 要判断的目标路径
 * @return {boolean}
 */
export const isFileExists =  (target: string) => {
    const state = getFileState(target);
    return state && state.isFile();
};
