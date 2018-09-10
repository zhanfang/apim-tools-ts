declare namespace Apim {
    interface ISchemaManager {
        getSchemaData(): any;
        getCustomMockData(): any;
    }

    interface IMockManager {
        findMatchApiSchema(reqPathName: string, reqMethod: string, reqQuery: any, isPageVisit: boolean): any;
    }
}


