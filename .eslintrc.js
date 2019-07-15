module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
  },
  extends: [
    "standard",
  ],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    "comma-dangle": ["error", "always-multiline"],
    "indent": ["error", 2, {
      "SwitchCase": 1,
      "VariableDeclarator": 1,
      "outerIIFEBody": 1,
      "MemberExpression": 1,
      "FunctionDeclaration": { "parameters": 1, "body": 1 },
      "FunctionExpression": { "parameters": 1, "body": 1 },
      "CallExpression": { "arguments": 1 },
      "ArrayExpression": 1,
      "ObjectExpression": 1,
      "ImportDeclaration": 1,
      "flatTernaryExpressions": true,
      "ignoreComments": false
    }],
    "operator-linebreak": ["error", "after", { "overrides": { "?": "ignore", ":": "ignore" } }],
    "quote-props": ["error", "consistent-as-needed"],
  },
  overrides: [
    {
      files: ["*.test.js"],
      rules: {
        "quote-props": ["off"],
      },
    },
  ],
}
