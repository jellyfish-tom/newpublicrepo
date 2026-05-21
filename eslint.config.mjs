import { defineConfig, globalIgnores } from "eslint/config";
import stylistic from "@stylistic/eslint-plugin";
import react from "eslint-plugin-react";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: {
      "@stylistic": stylistic,
      react,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      curly: ["error", "all"],
      "no-restricted-syntax": [
        "error",
        {
          selector: "IfStatement[test.type='LogicalExpression']",
          message: "Assign complex conditional logic to a well-named variable first.",
        },
        {
          selector: "ConditionalExpression[test.type='LogicalExpression']",
          message: "Assign complex ternary conditions to a well-named variable first.",
        },
        {
          selector: "JSXExpressionContainer > LogicalExpression",
          message: "Assign JSX logical expressions to a well-named variable first.",
        },
        {
          selector: "ReturnStatement > LogicalExpression",
          message: "Assign returned logical expressions to a well-named variable first.",
        },
        {
          selector: "ArrowFunctionExpression[body.type='LogicalExpression']",
          message:
            "Assign arrow-function logical expressions to a well-named variable first.",
        },
      ],
      "react/no-multi-comp": [
        "error",
        {
          ignoreStateless: false,
        },
      ],
      "@stylistic/padding-line-between-statements": [
        "error",
        { blankLine: "always", prev: "import", next: "*" },
        { blankLine: "any", prev: "import", next: "import" },
        { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
        {
          blankLine: "any",
          prev: ["const", "let", "var"],
          next: ["const", "let", "var"],
        },
        { blankLine: "always", prev: "*", next: "return" },
        {
          blankLine: "always",
          prev: ["if", "for", "while", "do", "switch", "try", "block-like"],
          next: "*",
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
