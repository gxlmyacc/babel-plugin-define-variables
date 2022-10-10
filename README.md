# babel-plugin-define-variables
a babel plugin that like webpack.DefinePlugin

## installtion

```bash
  npm install --save-dev babel-plugin-define-variables
  // or 
  yarn add -D babel-plugin-define-variables
```

## config


```js
// babel.config.js
module.exports = {
  presets: [
    ...
  ],
  plugins: [
    [
      'babel-plugin-define-variables',
      {
        defines: {
          'process.env.BUILD_ENV': process.env.BUILD_ENV,
          'process.env.NODE_ENV': process.env.NODE_ENV,
        },
        builtIns: {
          // filename: false,
          // filehash: false,
          // dirname: false,
          // now: false,
          // timestamp: false,
          // packagename: false,
          // packageversion: false
        }
      }
    ],
   ...
  ]
};
```

## built-in define

- __filename__

  the filename of code file that relative of `package.json` path that current project.

- __filehash__
  
  the file`s hashcode of code file

- __dirname__

  the dirname of code file that relative of `package.json` path that current project.

- __now__

  the time that build moment. format: 'yyyy-MM-dd hh:mm:ss'

- __timestamp__

  the timestamp that build moment.

- __packagename__

  the package name of this project.

- __packageversion__

    the package version of this project. you can also use like this:

  ```js
  __packageversion__('react');
  ```
  that you will get version of react;

## demo

src/index.js:

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
```

output/index.js:

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
