# babel-plugin-define-variables

一个类似 webpack.DefinePlugin 的 Babel 插件，用于在编译时定义全局变量和常量。

[![NPM version](https://img.shields.io/npm/v/babel-plugin-define-variables.svg?style=flat)](https://npmjs.com/package/babel-plugin-define-variables)
[![NPM downloads](https://img.shields.io/npm/dm/babel-plugin-define-variables.svg?style=flat)](https://npmjs.com/package/babel-plugin-define-variables)

## 🌍 语言

- [English](README.md)
- [中文](README_CN.md) (当前)

## 📖 简介

`babel-plugin-define-variables` 是一个强大的 Babel 插件，它允许你在编译时定义全局变量和常量，类似于 webpack 的 DefinePlugin。这个插件特别适用于：

- 在构建时注入环境变量
- 定义构建时的常量值
- 获取文件信息（文件名、路径、哈希等）
- 获取包信息和版本号
- 注入时间戳和构建时间

## 🚀 安装

```bash
npm install --save-dev babel-plugin-define-variables
# 或者
yarn add -D babel-plugin-define-variables
```

## ⚙️ 配置

### 基本配置

#### 最小配置（所有内置变量启用）
```js
// babel.config.js
module.exports = {
  presets: [
    '@babel/preset-env'
  ],
  plugins: [
    [
      'babel-plugin-define-variables',
      {
        defines: {
          'process.env.BUILD_ENV': process.env.BUILD_ENV,
          'process.env.NODE_ENV': process.env.NODE_ENV,
          'VERSION': '1.0.0',
          'IS_PRODUCTION': process.env.NODE_ENV === 'production'
        }
        // 未指定 builtIns - 所有变量默认启用
      }
    ]
  ]
};
```

#### 显式配置（与最小配置相同）
```js
// babel.config.js
module.exports = {
  presets: [
    '@babel/preset-env'
  ],
  plugins: [
    [
      'babel-plugin-define-variables',
      {
        defines: {
          'process.env.BUILD_ENV': process.env.BUILD_ENV,
          'process.env.NODE_ENV': process.env.NODE_ENV,
          'VERSION': '1.0.0',
          'IS_PRODUCTION': process.env.NODE_ENV === 'production'
        },
        builtIns: {
          filename: true,      // 启用 __filename__ (默认)
          filehash: true,      // 启用 __filehash__ (默认)
          dirname: true,       // 启用 __dirname__ (默认)
          now: true,           // 启用 __now__ (默认)
          timestamp: true,     // 启用 __timestamp__ (默认)
          packagename: true,   // 启用 __packagename__ (默认)
          packageversion: true // 启用 __packageversion__ (默认)
        }
      }
    ]
  ]
};
```

### 配置选项说明

#### `defines` 对象
用于定义自定义的全局变量，支持以下值类型：
- 字符串
- 数字
- 布尔值
- 对象（会被序列化为 JSON 字符串）

#### `builtIns` 对象
控制内置变量的启用/禁用状态。**所有内置变量默认都是启用的**。如果您想禁用某些变量，需要明确将其设置为 `false`。

**重要说明：**
- 如果您希望所有变量都启用，则无需指定 `builtIns`（默认行为）
- 只需指定您想要禁用的变量，将其设置为 `false`
- 未指定的变量将保持启用状态

| 选项 | 默认值 | 说明 |
|------|--------|------|
| `filename` | `true` | 是否启用 `__filename__` 变量 |
| `filehash` | `true` | 是否启用 `__filehash__` 变量 |
| `dirname` | `true` | 是否启用 `__dirname__` 变量 |
| `now` | `true` | 是否启用 `__now__` 变量 |
| `timestamp` | `true` | 是否启用 `__timestamp__` 变量 |
| `packagename` | `true` | 是否启用 `__packagename__` 变量 |
| `packageversion` | `true` | 是否启用 `__packageversion__` 变量 |

**禁用特定内置变量的示例：**
```js
{
  builtIns: {
    filename: false,    // 禁用 __filename__
    filehash: false,   // 禁用 __filehash__
    now: false         // 禁用 __now__
    // 其他变量保持默认启用状态
  }
}
```

## 🔧 内置变量

### 文件信息变量

#### `__filename__`
当前代码文件相对于项目根目录（`package.json` 所在目录）的文件路径。

**示例：**
```js
console.log(__filename__); // 输出: "/src/components/Button.js"
```

#### `__dirname__`
当前代码文件相对于项目根目录的目录路径。

**示例：**
```js
console.log(__dirname__); // 输出: "/src/components"
```

#### `__filehash__`
当前代码文件的哈希值，基于文件名生成。

**示例：**
```js
console.log(__filehash__); // 输出: "d7bfcc4a"
```

### 时间相关变量

#### `__now__`
构建时刻的时间，格式为 `'yyyy-MM-dd hh:mm:ss'`。

**示例：**
```js
console.log(__now__); // 输出: "2024-01-15 14:30:25"
```

#### `__timestamp__`
构建时刻的时间戳（毫秒）。

**示例：**
```js
console.log(__timestamp__); // 输出: 1705312225000
```

### 包信息变量

#### `__packagename__`
当前项目的包名。

**示例：**
```js
console.log(__packagename__); // 输出: "babel-plugin-define-variables"
```

#### `__packageversion__`
当前项目的包版本号，或者指定包的版本号。

**用法：**
```js
// 获取当前项目版本
console.log(__packageversion__); // 输出: "0.0.4"

// 获取指定包的版本
console.log(__packageversion__('react')); // 输出: "18.2.0"
console.log(__packageversion__('@babel/core')); // 输出: "7.5.4"
```

## 💡 使用场景

### 1. 环境变量注入
```js
// 配置
{
  defines: {
    'process.env.API_URL': process.env.API_URL || 'http://localhost:3000',
    'process.env.DEBUG': process.env.DEBUG || false
  }
}

// 使用
if (process.env.DEBUG) {
  console.log('API URL:', process.env.API_URL);
}
```

### 2. 构建信息注入
```js
// 配置
{
  defines: {
    'BUILD_TIME': new Date().toISOString(),
    'GIT_COMMIT': process.env.GIT_COMMIT || 'unknown'
  }
}

// 使用
console.log('Build time:', BUILD_TIME);
console.log('Git commit:', GIT_COMMIT);
```

### 3. 文件路径处理
```js
// 使用内置变量
const configPath = __dirname__ + '/config.json';
const fileHash = __filehash__;
```

### 4. 版本信息管理
```js
// 检查版本
if (__packageversion__('react').startsWith('18.')) {
  console.log('Using React 18');
}

// 显示构建信息
console.log(`Building ${__packagename__} v${__packageversion__} at ${__now__}`);
```

## 📝 完整示例

### 源代码 (src/index.js)

```js
function test() {
  console.log('__filename__', __filename__);
  console.log('__filehash__', __filehash__);
  console.log('__dirname__', __dirname__);
  console.log('__now__', __now__);
  console.log('__timestamp__', __timestamp__);
  console.log('__packagename__', __packagename__);
  console.log('__packageversion__', __packageversion__);
  console.log('__packageversion__', __packageversion__(''));
  console.log('__packageversion__', __packageversion__('@babel/cli'));
  console.log('process.env.BUILD_ENV', process.env.BUILD_ENV);
  __packageversion__.split('.');
}

export default test;
```

### 编译后输出

```js
function test() {
  console.log('__filename__', "/demo/src/test1.js");
  console.log('__filehash__', "d7bfcc4a");
  console.log('__dirname__', "/demo/src");
  console.log('__now__', "2020-12-03 18:43:46");
  console.log('__timestamp__', 1606992227198);
  console.log('__packagename__', "babel-plugin-define-variables");
  console.log('__packageversion__', "0.0.2");
  console.log('__packageversion__', "");
  console.log('__packageversion__', "7.6.4");
  console.log('process.env.BUILD_ENV', "test");
  "0.0.2".split('.');
}
```

## 🔍 注意事项

1. **性能考虑**：内置变量在编译时计算，不会影响运行时性能
2. **文件路径**：文件路径变量基于项目根目录（`package.json` 所在目录）计算
3. **版本获取**：`__packageversion__('packageName')` 会尝试解析指定包的版本，如果包不存在则返回空字符串
4. **时间变量**：`__now__` 和 `__timestamp__` 在每次构建时生成，不是运行时计算

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🔗 相关链接

- [Babel](https://babeljs.io/)
- [webpack DefinePlugin](https://webpack.js.org/plugins/define-plugin/)
- [hash-sum](https://github.com/bevacqua/hash-sum)
