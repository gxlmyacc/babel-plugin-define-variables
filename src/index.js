
const hash = require('hash-sum');
const {
  getConstCache,
  var2Expression,
  expr2str,
  getPackage,
  mergeObject
} = require('./utils');

function createHash(filename, pkg) {
  if (pkg) filename = `${pkg.name}!${filename}`;
  return `${hash(filename.replace(/\\/g, '/'))}`;
}

module.exports = function ({ types: t }) {
  const options = {
    builtIns: {
      filename: true,
      filehash: true,
      dirname: true,
      now: true,
      timestamp: true,
      packagename: true,
      packageversion: true
    }
  };
  function IdentifierVisitor(path, { opts, cache }) {
    let parent = path.parent;
    if (!parent) return;
    if (['FunctionDeclaration', 'ClassMethod', 'ObjectMethod'].includes(parent.type)) return;
    if (parent.type === 'ObjectProperty' && parent.key === path.node) return;
    if (parent.type === 'VariableDeclarator' && parent.id === path.node) return;

    let identifier = expr2str(path.node);
    if (parent.type === 'MemberExpression') {
      let parentPath = path.parentPath;
      while (parentPath && parentPath.node.type === 'MemberExpression'
        && path.node === parentPath.node.property) {
        identifier = `${expr2str(parentPath.node.object)}.${identifier}`;
        path = parentPath;
        parentPath = parentPath.parentPath;
      }
    } else if (parent.type === 'CallExpression' && expr2str(parent.callee) === identifier) {
      if (identifier !== '__packageversion__' 
        || !parent.arguments.length 
        || !t.isStringLiteral(parent.arguments[0])) return;
      path = path.parentPath;
      let packageName = expr2str(path.node.arguments[0]);
      let packagePath = packageName && require.resolve(packageName);
      let pkg = getPackage(packagePath);
      path.replaceWith(t.stringLiteral(pkg ? pkg.version : ''));
      return;
    }

    const defines = (opts && opts.defines) || {};
    if (options.builtIns.filename && identifier === '__filename__') {
      path.replaceWith(t.stringLiteral(cache.filename));
    } else if (options.builtIns.dirname && identifier === '__dirname__') {
      path.replaceWith(t.stringLiteral(cache.dirname));
    } else if (options.builtIns.now && identifier === '__now__') {
      path.replaceWith(t.stringLiteral(cache.now));
    } else if (options.builtIns.timestamp && identifier === '__timestamp__') {
      path.replaceWith(t.numericLiteral(Date.now()));
    } else if (options.builtIns.filehash && identifier === '__filehash__') {
      path.replaceWith(t.stringLiteral(createHash(cache.filename, cache.pkg)));
    }  else if (defines[identifier] !== undefined) {
      path.replaceWith(var2Expression(defines[identifier]));
    } else if (cache.pkg) {
      if (options.builtIns.packagename && identifier === '__packagename__') {
        path.replaceWith(t.stringLiteral(cache.pkg.name));
      } else if (options.builtIns.packageversion && identifier === '__packageversion__') {
        path.replaceWith(t.stringLiteral(cache.pkg.version));
      }
    }
  }

  return {
    visitor: {
      Program: {
        enter(path, state) {
          const {
            file: {
              opts: { filename }
            },
            opts,
          } = state;
          const cache = getConstCache(filename);

          mergeObject(options, opts);

          path.traverse({
            Identifier: IdentifierVisitor
          }, {
            cache,
            opts
          });
        },
      },
    }
  };
};