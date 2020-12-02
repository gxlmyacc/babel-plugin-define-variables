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
        }
      }
    ],
   ...
  ]
};
```

## built-in define

- __filename 

  the filename of code file than relative of `package.json` path that current project.

- __dirname

  the dirname of code file than relative of `package.json` path that current project.

- __now

  the time that build moment. format: 'yyyy-MM-dd hh:mm:ss'

- __timestamp

  the timestamp that build moment.

- __packagename

  the package name of this project.

- __packageversion

    the package version of this project. you can also use like this:

  ```js
  __packageversion('react');
  ```
  that you will get version of react;
