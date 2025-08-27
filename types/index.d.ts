/**
 * babel-plugin-define-variables 插件的类型定义
 */

/** 当前代码文件相对于项目根目录的文件路径 */
declare const __filename__: string;

/** 当前代码文件的哈希值 */
declare const __filehash__: string;

/** 当前代码文件相对于项目根目录的目录路径 */
declare const __dirname__: string;

/** 构建时刻的时间，格式为 'yyyy-MM-dd hh:mm:ss' */
declare const __now__: string;

/** 构建时刻的时间戳（毫秒） */
declare const __timestamp__: number;

/** 当前项目的包名 */
declare const __packagename__: string;

/** 
 * 当前项目的包版本号，或者指定包的版本号
 * @param packageName 可选的包名，如果不提供则返回当前项目版本
 * @returns 版本号字符串
 */
declare const __packageversion__: {
  (): string;
  (packageName: string): string;
};

/**
 * 插件配置选项接口
 */
export interface PluginOptions {
  /** 自定义定义的全局变量 */
  defines?: Record<string, any>;
  /** 内置变量的启用/禁用配置 */
  builtIns?: {
    /** 是否启用 __filename__ 变量 */
    filename?: boolean;
    /** 是否启用 __filehash__ 变量 */
    filehash?: boolean;
    /** 是否启用 __dirname__ 变量 */
    dirname?: boolean;
    /** 是否启用 __now__ 变量 */
    now?: boolean;
    /** 是否启用 __timestamp__ 变量 */
    timestamp?: boolean;
    /** 是否启用 __packagename__ 变量 */
    packagename?: boolean;
    /** 是否启用 __packageversion__ 变量 */
    packageversion?: boolean;
  };
}
