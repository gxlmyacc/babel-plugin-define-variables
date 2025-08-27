# babel-plugin-define-variables

A Babel plugin that works like webpack.DefinePlugin for defining global variables and constants at compile time.

[![NPM version](https://img.shields.io/npm/v/babel-plugin-define-variables.svg?style=flat)](https://npmjs.com/package/babel-plugin-define-variables)
[![NPM downloads](https://img.shields.io/npm/dm/babel-plugin-define-variables.svg?style=flat)](https://npmjs.com/package/babel-plugin-define-variables)

## 🌍 Language

- [English](README.md) (Current)
- [中文](README_CN.md)

## 📖 Introduction

`babel-plugin-define-variables` is a powerful Babel plugin that allows you to define global variables and constants at compile time, similar to webpack's DefinePlugin. This plugin is particularly useful for:

- Injecting environment variables at build time
- Defining build-time constant values
- Getting file information (filename, path, hash, etc.)
- Getting package information and version numbers
- Injecting timestamps and build times

## 🚀 Installation

```bash
npm install --save-dev babel-plugin-define-variables
# or
yarn add -D babel-plugin-define-variables
```

## ⚙️ Configuration

### Basic Configuration

#### Minimal Configuration (All Built-ins Enabled)
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
        // builtIns not specified - all variables enabled by default
      }
    ]
  ]
};
```

#### Explicit Configuration (Same as Minimal)
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
          filename: true,      // Enable __filename__ (default)
          filehash: true,      // Enable __filehash__ (default)
          dirname: true,       // Enable __dirname__ (default)
          now: true,           // Enable __now__ (default)
          timestamp: true,     // Enable __timestamp__ (default)
          packagename: true,   // Enable __packagename__ (default)
          packageversion: true // Enable __packageversion__ (default)
        }
      }
    ]
  ]
};
```

### Configuration Options

#### `defines` Object
Used to define custom global variables, supports the following value types:
- String
- Number
- Boolean
- Object (will be serialized to JSON string)

#### `builtIns` Object
Controls the enable/disable state of built-in variables. **All built-in variables are enabled by default**. If you want to disable any of them, you need to explicitly set them to `false`.

**Important Notes:**
- You don't need to specify `builtIns` if you want all variables enabled (default behavior)
- Only specify the variables you want to disable by setting them to `false`
- Unspecified variables will remain enabled

| Option | Default | Description |
|--------|---------|-------------|
| `filename` | `true` | Whether to enable `__filename__` variable |
| `filehash` | `true` | Whether to enable `__filehash__` variable |
| `dirname` | `true` | Whether to enable `__dirname__` variable |
| `now` | `true` | Whether to enable `__now__` variable |
| `timestamp` | `true` | Whether to enable `__timestamp__` variable |
| `packagename` | `true` | Whether to enable `__packagename__` variable |
| `packageversion` | `true` | Whether to enable `__packageversion__` variable |

**Example of disabling specific built-ins:**
```js
{
  builtIns: {
    filename: false,    // Disable __filename__
    filehash: false,   // Disable __filehash__
    now: false         // Disable __now__
    // Other variables remain enabled by default
  }
}
```

## 🔧 Built-in Variables

### File Information Variables

#### `__filename__`
The file path of the current code file relative to the project root directory (where `package.json` is located).

**Example:**
```js
console.log(__filename__); // Output: "/src/components/Button.js"
```

#### `__dirname__`
The directory path of the current code file relative to the project root directory.

**Example:**
```js
console.log(__dirname__); // Output: "/src/components"
```

#### `__filehash__`
The hash value of the current code file, generated based on the filename.

**Example:**
```js
console.log(__filehash__); // Output: "d7bfcc4a"
```

### Time-related Variables

#### `__now__`
The time at build moment, formatted as `'yyyy-MM-dd hh:mm:ss'`.

**Example:**
```js
console.log(__now__); // Output: "2024-01-15 14:30:25"
```

#### `__timestamp__`
The timestamp at build moment (milliseconds).

**Example:**
```js
console.log(__timestamp__); // Output: 1705312225000
```

### Package Information Variables

#### `__packagename__`
The package name of the current project.

**Example:**
```js
console.log(__packagename__); // Output: "babel-plugin-define-variables"
```

#### `__packageversion__`
The package version of the current project, or the version of a specified package.

**Usage:**
```js
// Get current project version
console.log(__packageversion__); // Output: "0.0.4"

// Get version of specified package
console.log(__packageversion__('react')); // Output: "18.2.0"
console.log(__packageversion__('@babel/core')); // Output: "7.5.4"
```

## 💡 Use Cases

### 1. Environment Variable Injection
```js
// Configuration
{
  defines: {
    'process.env.API_URL': process.env.API_URL || 'http://localhost:3000',
    'process.env.DEBUG': process.env.DEBUG || false
  }
}

// Usage
if (process.env.DEBUG) {
  console.log('API URL:', process.env.API_URL);
}
```

### 2. Build Information Injection
```js
// Configuration
{
  defines: {
    'BUILD_TIME': new Date().toISOString(),
    'GIT_COMMIT': process.env.GIT_COMMIT || 'unknown'
  }
}

// Usage
console.log('Build time:', BUILD_TIME);
console.log('Git commit:', GIT_COMMIT);
```

### 3. File Path Processing
```js
// Using built-in variables
const configPath = __dirname__ + '/config.json';
const fileHash = __filehash__;
```

### 4. Version Information Management
```js
// Check version
if (__packageversion__('react').startsWith('18.')) {
  console.log('Using React 18');
}

// Display build information
console.log(`Building ${__packagename__} v${__packageversion__} at ${__now__}`);
```

## 📝 Complete Example

### Source Code (src/index.js)

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

### Compiled Output

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

## 🔍 Notes

1. **Performance**: Built-in variables are calculated at compile time and won't affect runtime performance
2. **File Paths**: File path variables are calculated based on the project root directory (where `package.json` is located)
3. **Version Retrieval**: `__packageversion__('packageName')` will try to resolve the version of the specified package, returning an empty string if the package doesn't exist
4. **Time Variables**: `__now__` and `__timestamp__` are generated at each build, not calculated at runtime

## 🤝 Contributing

Issues and Pull Requests are welcome!

## 📄 License

MIT License

## 🔗 Related Links

- [Babel](https://babeljs.io/)
- [webpack DefinePlugin](https://webpack.js.org/plugins/define-plugin/)
- [hash-sum](https://github.com/bevacqua/hash-sum)
