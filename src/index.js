import 'better-log/install';
import { template, transformFromAst } from "@babel/core";
import typescript from '@babel/plugin-syntax-typescript';

const buildEnumWrapper = template(`
  const ID = (new (class ID extends Enum {})(ASSIGNMENTS));
`);

const buildElement = template(`
  NAME: VALUE
`);

module.exports = function ({ types: t }) {
  return {
    inherits: typescript,
    visitor: {
      TSEnumDeclaration(path) {
        const { node } = path;
        if (node.declare) {
          path.remove();
          return;
        }

        const name = node.id.name;
        const fill = enumFill(path, t, node.id);

        switch (path.parent.type) {
          case "BlockStatement":
          case "ExportNamedDeclaration":
          case "Program": {
            path.insertAfter(fill);
            if (seen(path.parentPath)) {
              path.remove();
            } else {
              const isGlobal = t.isProgram(path.parent); // && !path.parent.body.some(t.isModuleDeclaration);
              path.replaceWith(makeVar(node.id, t, isGlobal ? "var" : "let"));
            }
            break;
          }

          default:
            throw new Error(`Unexpected enum parent '${path.parent.type}`);
        }

        function seen(parentPath) {
          if (parentPath.isExportDeclaration()) {
            return seen(parentPath.parentPath);
          }

          if (parentPath.getData(name)) {
            return true;
          } else {
            parentPath.setData(name, true);
            return false;
          }
        }
      }
    },
  };
};

function enumFill(path, t, id) {
  const x = translateEnumValues(path, t);
  const assignments = x.map(([memberName, memberValue]) => {
    if (!memberName) {
      return;
    }
    const { code } = transformFromAst({
      type: "Program",
      body: [{ type: "ExpressionStatement", expression: memberValue }],
      sourceType: "module"
    }, null, { compact: true, minified: true, ast: false })
    console.log(code.replace(/;$/, ''))
    return `${memberName}: ${code.replace(/;$/, '')}`
  }).filter(Boolean);

  return buildEnumWrapper({
    ID: t.cloneNode(id),
    ASSIGNMENTS: `{
  ${assignments.join(`,
  `)}
}`,
  });
}

function makeVar(id, t, kind) {
  return t.importDeclaration([t.importDefaultSpecifier(t.identifier('Enum'))], t.stringLiteral('objective-enums'));
}

function translateEnumValues(path, t) {
  const seen = {};
  return path.node.members.map((member, n) => {
    const name = t.isIdentifier(member.id) ? member.id.name : member.id.value;
    const initializer = member.initializer;
    let value;
    if (initializer) {
      const constValue = evaluate(initializer, seen);
      if (constValue !== undefined) {
        seen[name] = constValue;
        value = typeof constValue === "number" ? t.numericLiteral(constValue) : t.stringLiteral(constValue);
      } else {
        value = initializer;
      }
    } else {
      value = t.numericLiteral(n + 1);
      seen[name] = n + 1;
    }
    return [name, value];
  });
}

function evaluate(
  expr,
  seen,
) {
  if (expr.type === "StringLiteral") {
    return expr.value;
  }
  return evalConstant(expr);

  function evalConstant(expr) {
    switch (expr.type) {
      case "UnaryExpression":
        return evalUnaryExpression(expr);
      case "BinaryExpression":
        return evalBinaryExpression(expr);
      case "NumericLiteral":
        return expr.value;
      case "ParenthesizedExpression":
        return evalConstant(expr.expression);
      case "Identifier":
        return seen[expr.name];
      default:
        return undefined;
    }
  }

  function evalUnaryExpression({
    argument,
    operator,
  }) {
    const value = evalConstant(argument);
    if (value === undefined) {
      return undefined;
    }

    switch (operator) {
      case "+":
        return value;
      case "-":
        return -value;
      case "~":
        return ~value;
      default:
        return undefined;
    }
  }

  function evalBinaryExpression(expr) {
    const left = evalConstant(expr.left);
    if (left === undefined) {
      return undefined;
    }
    const right = evalConstant(expr.right);
    if (right === undefined) {
      return undefined;
    }

    switch (expr.operator) {
      case "|":
        return left | right;
      case "&":
        return left & right;
      case ">>":
        return left >> right;
      case ">>>":
        return left >>> right;
      case "<<":
        return left << right;
      case "^":
        return left ^ right;
      case "*":
        return left * right;
      case "/":
        return left / right;
      case "+":
        return left + right;
      case "-":
        return left - right;
      case "%":
        return left % right;
      default:
        return undefined;
    }
  }
}