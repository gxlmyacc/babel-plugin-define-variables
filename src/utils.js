const t = require('@babel/types');
const findUp = require('find-up');
const fs = require('fs');
const path = require('path');
const template = require('@babel/template').default;

function formatDate(date, fmt) {
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    S: date.getMilliseconds()
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  Object.keys(o).forEach(k => {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
    }
  });
  return fmt;
}

function fileExists(path) {
  try {
    return !fs.accessSync(path, fs.F_OK);
  } catch (e) {
    return false;
  }
}

function getConfigPath(filename) {
  let packagePath = findUp.sync('package.json', {
    cwd: path.dirname(filename),
    type: 'file'
  });
  if (packagePath && fileExists(packagePath)) return packagePath;
}

const NOW = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss');
const constCached = [];
function getConstCache(filename) {
  const pkgPath = getConfigPath(filename);
  if (!pkgPath || filename === path.resolve(pkgPath)) return {};

  let cwd;

  let cache = constCached[pkgPath];
  if (!cache) {
    let pkg = require(pkgPath);
    if (!pkg || !Object.keys(pkg).length) return {};

    cwd = path.dirname(pkgPath);

    cache = { pkg, cwd };
    constCached[pkgPath] = cache;

    cache.now = NOW;
  }
  cwd = cache.cwd;

  cache.filename = '/' + path.relative(cwd, filename).replace(/\\/g, '/');
  cache.dirname = '/' + path.relative(cwd, path.dirname(filename)).replace(/\\/g, '/');

  return cache;
}

function arr2Expression(arr, parent) {
  let temp = '';
  let vars = {};
  arr.forEach((v, i) => {
    // eslint-disable-next-line no-use-before-define
    let expr = var2Expression(v, arr);
    if (!expr) return;
    let key = `$${i}`;
    temp += (temp ? ', ' : '') + key;
    vars[key] = expr;
  });
  return template(`[${temp}]`)(vars);
}

function obj2Expression(obj, parent) {
  let props = Object.keys(obj).map(k => {
    let v = obj[k];
    // eslint-disable-next-line no-use-before-define
    let expr = var2Expression(v, obj);
    if (!expr) return;
    return t.objectProperty(t.identifier(k), expr);
  }).filter(Boolean);
  return t.objectExpression(props);
}

function var2Expression(v, parent) {
  if (t.isNode(v)) return v;
  if (v === undefined) return;
  if (Array.isArray(v)) return arr2Expression(v, parent);
  switch (typeof v) {
    case 'string': return t.stringLiteral(v);
    case 'boolean': return t.booleanLiteral(v);
    case 'number': return t.numericLiteral(v);
    case 'object':
      if (v === null) return t.nullLiteral();
      if (v instanceof RegExp) return t.regExpLiteral(v.source, v.flags);
      if (v instanceof Date) return template('new Date(TIME)')({ TIME: t.numericLiteral(v.getTime()) });
      if (v instanceof Function) return template(v.toString())();
      return obj2Expression(v, parent);
    default: return t.identifier('undefined');
  }
}

function expr2str(expr) {
  if (!expr) return '';
  if (typeof expr === 'string') return expr;
  // if (expr.extra) return expr.extra.raw;
  switch (expr.type) {
    case 'JSXExpressionContainer':
      return expr2str(expr.expression);
    case 'MemberExpression':
    case 'JSXMemberExpression':
      // eslint-disable-next-line no-use-before-define
      return memberExpr2Str(expr);
    case 'Identifier':
    case 'JSXIdentifier':
      return expr.name;
    case 'JSXNamespacedName':
      return `${expr.namespace.name}:${expr.name.name}`;
    case 'ThisExpression':
      return 'this';
    case 'NumericLiteral':
    case 'BooleanLiteral':
    case 'StringLiteral':
      return expr.value;
    case 'NullLiteral':
      return 'null';
    case 'RegExpLiteral':
      return `/${expr.pattern}/${expr.flags}`;
    case 'SpreadElement':
      return `...${expr2str(expr.argument)}`;
    case 'BinaryExpression':
      return `${expr2str(expr.left)} ${expr.operator} ${expr2str(expr.right)}`;
    case 'UpdateExpression':
    case 'UnaryExpression':
      return `${expr.prefix ? expr.operator : ''}${expr2str(expr.argument)}${!expr.prefix ? expr.operator : ''}`;
    case 'ConditionalExpression':
      return `${expr2str(expr.test)} ? ${expr2str(expr.consequent)} : ${expr2str(expr.alternate)}`;
    case 'CallExpression':
      return `${expr2str(expr.callee)}(${expr.arguments.map(a => expr2str(a)).join(',')})`;
    case 'NewExpression':
      return `new ${expr2str(expr.callee)}(${expr.arguments.map(a => expr2str(a)).join(',')})`;
    case 'VariableDeclarator':
      return `${expr.id}${expr.init ? ` = ${expr2str(expr.init)}` : ''}`;
    case 'VariableDeclaration':
      return `${expr.kind} ${expr.declarations.map(d => expr2str(d))};`;
    case 'BlockStatement':
      return `{${expr2str(expr.body)}}`;
    case 'TemplateLiteral':
      // eslint-disable-next-line no-use-before-define
      return temp2var(expr);
    case 'TaggedTemplateExpression':
      return `${expr2str(expr2str(expr.tag))}${expr2str(expr.quasi)}`;
    case 'FunctionExpression':
      return `function ${expr2str(expr.id)}(${expr.params.map(a => expr2str(a)).join(',')})${expr2str(expr.body)}`;
    case 'AssignmentPattern':
      return `${expr2str(expr.left)} = ${expr2str(expr.right)}`;
    case 'ArrayExpression':
    case 'ArrayPattern':
      return `[${expr.elements.map(v => expr2str(v)).join(', ')}]`;
    case 'ObjectProperty':
      return `${expr.computed ? `[${expr2str(expr.key)}]` : expr2str(expr.key)}: ${expr2str(expr.value)}`;
    case 'ObjectMethod':
      // eslint-disable-next-line
      return `${expr.kind !== 'method' ? `${expr.kind} ` : ''}${expr2str(expr.key)}(${expr.params.map(a => expr2str(a)).join(', ')})${expr2str(expr.body)}`;
    case 'ObjectPattern':
    case 'ObjectExpression':
      return `{${expr.properties.map(v => expr2str(v)).join(', ')}}`;
    default: return '';
  }
}

function temp2var(expr) {
  let arr = [...expr.expressions, ...expr.quasis].sort((a, b) => a.start - b.start);
  let ret = '';
  arr.forEach(v => {
    if (v.type === 'TemplateElement') ret += v.value.raw;
    else ret += '${' + expr2str(v) + '}';
  });
  return '`' + ret + '`';
}

function memberExpr2Str(expr) {
  let objStr;
  const object = expr.object;
  if (!object) return String(expr.value);
  switch (expr.object.type) {
    case 'MemberExpression':
    case 'JSXMemberExpression':
      objStr = memberExpr2Str(expr.object);
      break;
    default:
      objStr = expr2str(expr.object);
  }
  let propIsMember = expr.property.type === 'MemberExpression';
  let propStr = expr2str(expr.property);
  return objStr + (objStr && !propIsMember ? '.' : '') + (propIsMember ? `[${propStr}]` : propStr);
}

function getPackage(filename) {
  let configPath = filename && getConfigPath(filename);
  if (configPath) return require(configPath);
}


module.exports = {
  getConstCache,
  var2Expression,
  arr2Expression,
  obj2Expression,
  expr2str,
  getConfigPath,
  getPackage
};