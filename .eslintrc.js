module.exports = {
  root: true,
  extends: [
    "@cybozu/eslint-config/presets/typescript-prettier",
  ],
  globals: {
    process: true
  },
  parserOptions: {
    project: './tsconfig.json'
  }
};