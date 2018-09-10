/**
 * @file 接口 mock 管理
 * @author zhanfang(fzhanxd@gmail.com)
 */

import pathUtil from 'path';
import fs from 'fs';
import mkdirp from 'mkdirp';
import json5 from 'json5';
import uuidv1 from 'uuid/v1';
import reqMatcher from '../helper/request-matcher';

// const util = require('../util');
// const mockTypes = require('./mock-types');

function formatMockData(obj) {
    let data;
    if (Array.isArray(obj)) {
        data = [].concat(obj);
    }
    else {
        data = util.obj2arr(obj, 'name');
    }

    data.forEach(item => {
        try {
            let type = +item.type;
            if (type === mockTypes.MOCK_CONTENT_JSON5_TYPE
                || type === mockTypes.MOCK_CONTENT_MOCKJS_TYPE
            ) {
                item.content = json5.stringify(
                    json5.parse(item.content), null, 4
                );
            }
        }
        catch (ex) {
            console.error(ex);
        }
    });

    return data;
}

function matchAPI(condition: IConditionApiId, apiList: any[]): any {
    if (!apiList) {
        return;
    }

    let found = null;
    apiList.some(item => {
        let match;
        if (condition.apiId) {
            match = item.id === condition.apiId;
        }
        else {
            match = reqMatcher.match(condition, item);
        }

        if (match) {
            found = {
                api: item,
                params: match.params
            };
        }

        return found;
    });

    return found;
}

interface ICondition {
    pathname: string;
    method: string;
    query: any;
    isPageVisit: boolean;
    apiId?: any;
}

interface IOptions {
    root?: string;
    confPath?: string;
}

class MockManager implements Apim.IMockManager {
    private schemaManger: Apim.ISchemaManager;

    /**
     * 创建 mock 管理实例
     *
     * @param {Object} schemaManager schema 管理实例
     * @param {Object} options 创建选项
     * @param {string} options.root 配置存储的根目录
     * @param {string} options.confPath 配置存储的路径
     */
    constructor(schemaManager: any, options: IOptions) {
        this.schemaManger = schemaManager;
    }

    /**
     * 查找匹配的请求接口定义
     *
     * @param {string} reqPathName 请求路径名
     * @param {string} reqMethod 请求方法
     * @param {Object} reqQuery 请求的查询参数
     * @param {boolean=} isPageVisit 是否是页面访问
     * @return {Object}
     */
    public findMatchApiSchema(reqPathName: string, reqMethod: string, reqQuery: any, isPageVisit: boolean) {
        const condition = {
            pathname: reqPathName,
            method: reqMethod,
            query: reqQuery,
            isPageVisit
        };
        const schemaData = this.matchApiSchemaData(condition);

        const customMockInfo = this.matchCustomMockData({
            apiId: schemaData && schemaData.api.id,
            ...condition
        });

        let result = null;
        if (schemaData) {
            result = Object.assign({}, schemaData.api);
            result.routeParams = schemaData.params;
            result.mocks = formatMockData(result.mocks);

            if (customMockInfo) {
                result.mocks = result.mocks.concat(
                    formatMockData(customMockInfo.api.mocks)
                );
            }
        }
        else if (customMockInfo) {
            result = Object.assign({}, customMockInfo.api);
            result.routeParams = customMockInfo.params;
            result.mocks = formatMockData(result.mocks);
        }

        if (customMockInfo) {
            result.selectCase = customMockInfo.api.selectCase;
        }

        return result;
    }

    /**
     * 匹配自定义的 mock 数据
     *
     * @param {Object} condition 匹配条件
     * @param {string=} condition.pathname 请求路径名
     * @param {string=} condition.method 请求方法
     * @param {Object=} condition.query 请求的查询参数
     * @param {string=} condition.apiId 接口 id
     * @return {?Object}
     */
    private matchCustomMockData(condition: ICondition) {
        const customData = this.schemaManger.getCustomMockData();
        return matchAPI(condition, customData.list);
    }

    /**
     * 匹配当前给定的请求的接口定义数据
     *
     * @param {Object} condition 匹配条件
     * @param {string=} condition.pathname 请求路径名
     * @param {string=} condition.method 请求方法
     * @param {Object=} condition.query 请求的查询参数
     * @param {boolean=} condition.isPageVisit 是否是页面访问
     * @return {?Object}
     */
    private matchApiSchemaData(condition: ICondition) {
        const schemaData = this.schemaManger.getSchemaData();
        return matchAPI(condition, schemaData.schemaList);
    }

}

let instance: Apim.IMockManager = null;

/**
 * 获取 mock 管理 实例
 *
 * @param {SchemaManager} schemaManger schema 管理实例
 * @param {Object} options 选项
 * @return {Object}
 */
export const getMockManager = (schemaManger: any, options: IOptions) => {
    if (!instance) {
        instance = new MockManager(schemaManger, options);
    }

    return instance;
};

export default MockManager;
