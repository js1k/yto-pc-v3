module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/standard',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    eqeqeq: "off", // 使用 === 替代 ==
    quotes: ["off"],
    indent: ["error", 4, { SwitchCase: 1 }],
    semi: ["error", "always"],
    curly: "off",
    "standard/computed-property-even-spacing": 0,
    "no-return-assign": "off",
    "one-var": "off",
    "space-before-function-paren": 0,
    "no-useless-escape": "off",
    "no-tabs": "off",
    "no-debugger": process.env.NODE_ENV === "prod" || process.env.NODE_ENV === "test" ? "error" : "off",
    "no-console": process.env.NODE_ENV === "prod" || process.env.NODE_ENV === "test" ? "error" : "off"
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        mocha: true
      }
    }
  ]
}
