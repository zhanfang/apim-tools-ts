/**
 * @file 入口文件
 * @author zhanfang <fzhanxd@gmail.com>
 */
import chalk from 'chalk';
import path from 'path';

interface IApimOptions {
    port: number,
    root: string,
    clientRequestPrefix: string
}

exports.koa =  (options: IApimOptions) => {};