/**
 * @file 接口 schema 助手工具方法
 * @author zhanfang(fzhanxd@gmail.com)
 */

import fs from 'fs';
import json5 from 'json5';
import { isFileExists } from '../util';

export const readData = (schemaFile: string) => {
    if (isFileExists(schemaFile)) {
        try {
            let content = fs.readFileSync(schemaFile).toString();
            content = json5.parse(content);
            return content;
        }
        catch (ex) {
            console.log('read data fail:', ex.stack || ex.toString());
            return {};
        }
    }
    return {};
};
