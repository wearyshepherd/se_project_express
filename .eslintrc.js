module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "airbnb-base", "prettier"],
  overrides: [],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module", // or "script" based on your project
  },
  rules: {
    "no-underscore-dangle": ["error", { allow: ["_id"] }],
    "no-unused-vars": ["error", { argsIgnorePattern: " next" }],
  },
};
