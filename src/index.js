
const {
  getConstCache,
  var2Expression,
  expr2str,
  getPackage
} = require('./utils');

module.exports = function ({ types: t }) {
  function IdentifierVisitor(path, { opts, cache }) {
    let parent = path.parent;
    if (!parent) return;
    if (['FunctionDeclaration', 'ClassMethod', 'ObjectMethod'].includes(parent.type)) return;
    if (parent.type === 'ObjectProperty' && parent.key === path.node) return;
    if (parent.type === 'VariableDeclarator' && parent.id === path.node) return;

    let identifier = expr2str(path.node);
    if (parent.type === 'MemberExpression') {
      let parentPath = path.parentPath;
      while (parentPath && parentPath.node.type === 'MemberExpression') {
        if (path.node === parentPath.node.property) identifier = `${expr2str(parentPath.node.object)}.${identifier}`;
        path = parentPath;
        parentPath = parentPath.parentPath;
      }
    } else if (parent.type === 'CallExpression' && expr2str(parent.callee) === identifier) {
      if (identifier !== '__packageversion' 
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
    if (identifier === '__filename') {
      path.replaceWith(t.stringLiteral(cache.filename));
    } else if (identifier === '__dirname') {
      path.replaceWith(t.stringLiteral(cache.dirname));
    } else if (identifier === '__now') {
      path.replaceWith(t.stringLiteral(cache.now));
    } else if (identifier === '__timestamp') {
      path.replaceWith(t.numericLiteral(Date.now()));
    } else if (defines[identifier] !== undefined) {
      path.replaceWith(var2Expression(defines[identifier]));
    } else if (cache.pkg) {
      if (identifier === '__packagename') {
        path.replaceWith(t.stringLiteral(cache.pkg.name));
      } else if (identifier === '__packageversion') {
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