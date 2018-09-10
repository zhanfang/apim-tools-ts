/**
 * @file log 工具方法
 * @author zhanfang(fzhanxd@gmail.com)
 */

import chalk from 'chalk';
import {isPlainObject} from 'lodash';
import { LOG_LEVEL } from '../constants/log';

declare module 'chalk' {
    interface Chalk {
        [key: string]: any
    }
}

/**
 * 补齐时间 8->08 12->12
 * 
 * @param num 
 * @param bitNum 
 * @param padValue
 * @return {string}
 */
function padNum(num:number, bitNum = 2, padValue = 0) {
    const value = '' + num;
    const padItems = [];
    for (let i = 0, len = bitNum - value.length; i < len; i++) {
        padItems[padItems.length] = padValue;
    }

    return padItems.join('') + num;
}

/**
 * 获取当前系统时间
 *
 * @return {string}
 */
function getCurrentTime() {
    const date = new Date();

    return date.getFullYear() + '-' + padNum(date.getMonth() + 1)
        + '-' + padNum(date.getDate()) + ' ' + padNum(date.getHours())
        + ':' + padNum(date.getMinutes()) + ':' + padNum(date.getSeconds());
}

interface ILoggerOptions {
    prefix: string,
    level: string
}

interface ILogger {
    log(type:string, ...args:any[]):void,
    debug(...args:any[]):void,
    info(...args:any[]):void,
    warn(...args:any[]):void,
    error(...args:any[]):void
}

class Logger implements ILogger {
    
    private logPrefix   :string
    private logLevel    :number

    /**
     * 创建 logger 实例
     *
     * @param {Object} options 选项
     * @param {string=} options.prefix 打印 log 自定义前缀
     * @param {string=} options.level 打印 log level
     */
    constructor(options = {prefix: '', level: 'info'}) {
        this.logPrefix = options.prefix || '';
        this.setLogLevel(options.level);
    }

    /**
     * 设置打印 log 的层级，默认打印层级为 `info`
     * log层级大小定义：
     * debug > info > warn > error
     *
     * @param {string} level 要打印的层级，所有低于给定层级都不打印
     */
    public setLogLevel(level:string) {
        level = String(level).toLowerCase();
        if (!level || !LOG_LEVEL[level]) {
            level = 'info';
        }

        this.logLevel = LOG_LEVEL[level].id;
    }

    /**
     * 打印日志
     *
     * @param {string} type 打印的日志类型：info/warn/debug/error
     * @param {...*} args 打印的信息参数
     */
    public log(type:string, ...args:any[]):void {
        const logType = LOG_LEVEL[type];
        if (logType.id < this.logLevel) {
            return;
        }

        const appendArgs = (args || []).map(item => {
            if (item && (Array.isArray(item) || isPlainObject(item))) {
                return JSON.stringify(item);
            }
            return item;
        }).join(' ');

        const params = [
            chalk[logType.prefixColor](logType.prefix),
            chalk.gray(getCurrentTime()),
            chalk[logType.contentColor](appendArgs)
        ];

        if (this.logPrefix) {
            params.unshift(this.logPrefix);
        }
        console.log.apply(console, params);
    }

    /**
     * 打印 debug 信息
     *
     * @param {...*} args 打印的信息参数
     */
    public debug(...args:any[]):void {
        this.log('debug', ...args);
    }

    /**
     * 打印 info 信息
     *
     * @param {...*} args 打印的信息参数
     */
    public info(...args:any[]):void {
        this.log('info', ...args);
    }

    /**
     * 打印 warn 信息
     *
     * @param {...*} args 打印的信息参数
     */
    public warn(...args: any[]):void {
        this.log('warn', ...args);
    }

    /**
     * 打印 error 信息
     *
     * @param {...*} args 打印的信息参数
     */
    public error(...args: any[]):void {
        this.log('error', ...args);
    }
}

let instance:ILogger = null;

export const getLogger = (options?: ILoggerOptions) => {
    if (!instance) {
        instance = new Logger(options);
    }
    return instance;
};

export default Logger;
