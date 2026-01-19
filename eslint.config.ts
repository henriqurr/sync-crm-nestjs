import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import type { Linter } from 'eslint';
import importPlugin from 'eslint-plugin-import';
import importHelpers from 'eslint-plugin-import-helpers';
import prettier from 'eslint-plugin-prettier';
import promisePlugin from 'eslint-plugin-promise';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';

export default [
  eslint.configs.recommended,
  {
    files: ['**/*.ts'],
    ignores: ['node_modules', 'dist'],
  },
  {
    plugins: {
      'promise': promisePlugin,
      'import-helpers': importHelpers,
      '@typescript-eslint': tseslint,
      'unused-imports': unusedImports,
      'import': importPlugin,
      prettier,
    },
  },
  {
    languageOptions: {
      parser: tsParser,
      globals: { ...globals.node, ...globals.es2024 },
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },

    rules: {
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/consistent-return': 'error',
      '@typescript-eslint/method-signature-style': ['error', 'method'],
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/ban-ts-comment': 'off',

      '@typescript-eslint/no-explicit-any': 'off',

      '@typescript-eslint/consistent-type-exports': [
        'error',
        {
          fixMixedExportsWithInlineTypeSpecifier: true,
        },
      ],

      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          disallowTypeAnnotations: true,
          fixStyle: 'inline-type-imports',
          prefer: 'type-imports',
        },
      ],

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-non-null-assertion': 'error',

      'import/no-duplicates': 'error',
      'unused-imports/no-unused-imports': 'error',
      'import-helpers/order-imports': [
        'error',
        {
          newlinesBetween: 'always',
          groups: [
            '/^node:/',
            'module',
            '/^@//',
            ['parent', 'sibling', 'index'],
          ],
          alphabetize: {
            ignoreCase: true,
            order: 'asc',
          },
        },
      ],

      'prettier/prettier': ['error', {}, { usePrettierrc: true }],

      'curly': ['error', 'multi-line'],
      'no-console': 'warn',
      'no-useless-return': 'error',
      'no-unused-vars': 'off',
      'no-useless-rename': 'error',
      'no-debugger': 'error',

      'no-var': 'error',
      'prefer-const': 'error',
      'object-shorthand': ['error', 'always'],
      'eqeqeq': ['error', 'always'],
      'strict': ['error', 'global'],
    },
    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts'],
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
    },
  },
  {
    files: ['test/**/*.ts', '**/*.test.ts', '**/*.spec.ts', '**/*.e2e-spec.ts'],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-empty-function': 'off',
    },
  },
] as Linter.Config[];
