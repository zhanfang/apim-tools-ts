/**
 * @file schema 管理器
 * @author zhanfang(fzhanxd@gmail.com)
 */

import path from 'path';
import uuidv1 from 'uuid/v1';
import {getLogger} from '../helper/log';
import {isFileExists} from '../util';
import { readData } from './schema-helper';

interface IOptions {
    logger?: any;
    root?: string;
    schemaDirName?: string;
}

class SchemaManager implements Apim.ISchemaManager {
    private logger: any
    private schemaFile: string = 'schema'
    private schemaMockFile: string = 'mock'
    private schemaData: any
    private customMockData: any
    private schemaDir: string

    /**
     * 创建 schema 管理实例
     *
     * @param {Object} options 选项
     * @param {Object} options.logger 日志对象
     * @param {string} options.root schema 存储的根目录
     * @param {string} options.schemaDirName 存储 schema 目录名
     */
    constructor(options: IOptions = {}) {
        this.logger = options.logger || getLogger();
        this.schemaDir = path.join(
            options.root || process.cwd(),
            options.schemaDirName || '_interfaces'
        );
    }
    

    /**
     * 获取接口定义数据
     *
     * @return {Object}
     */
    public getSchemaData() {
        if (!this.schemaData) {
            this.schemaData = this.readSchemas();
        }
        return this.schemaData;
    }

    /**
     * 获取自定义的 mock 数据
     *
     * @return {Object}
     */
    public getCustomMockData() {
        if (!this.customMockData) {
            this.customMockData = this.readCustomMock();
        }
        return this.customMockData;
    }

    /**
     * 读取接口定义数据
     *
     * @private
     * @return {Object}
     */
    private readSchemas() {
        const schemaFile = this.schemaDir + this.schemaFile;
        if (!schemaFile) {
            return {};
        }
        if (!isFileExists(schemaFile)) {
            this.logger.error(
                'read project',
                'local schema fail,',
                'schema file is not existed:',
                schemaFile
            );
        }
        return readData.call(this, schemaFile);
    }

    /**
     * 读取自定义的 mock 数据
     *
     * @private
     * @return {Object}
     */
    private readCustomMock() {
        const mockFile = this.schemaDir + this.schemaMockFile;
        if (!mockFile) {
            return {};
        }
        return readData.call(this, mockFile);
    }

}

let instance: Apim.ISchemaManager = null;

/**
 * 获取 schema 管理实例
 *
 * @param {Object} options 创建选项
 * @return {SchemaManager}
 */
export const getSchemaManager = (options: IOptions) =>{
    if (!instance) {
        instance = new SchemaManager(options);
    }

    return instance;
};

export default SchemaManager;
