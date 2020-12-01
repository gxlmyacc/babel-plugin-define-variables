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
          a: 1,
          b: 'str',
          c: new Date(),
        }
      }
    ],
   ...
  ]
};
```

## built-in define

- __filename

- __dirname

- __now

- __timestamp

- __packagename

- __packageversion