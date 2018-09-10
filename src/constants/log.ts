interface ILogLevelConfig {
    readonly id          :number;
    readonly prefixColor :string;
    readonly contentColor:string;
    readonly prefix      :string;
}

export const LOG_LEVEL: {[index:string]: ILogLevelConfig} = {
    debug: {
        id: 0,
        prefixColor: 'green',
        contentColor: 'gray',
        prefix: '[DEBUG]'
    },
    info: {
        id: 1,
        prefixColor: 'green',
        contentColor: 'gray',
        prefix: ' [INFO]'
    },
    warn: {
        id: 2,
        prefixColor: 'yellow',
        contentColor: 'yellow',
        prefix: ' [WARN]'
    },
    error: {
        id: 3,
        prefixColor: 'red',
        contentColor: 'red',
        prefix: '[ERROR]'
    }
};