// @ts-check

import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import prettierConfig from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
import globals from 'globals'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default tseslint.config(
  {
    ignores: ['out/**', 'dist/**', 'node_modules/**']
  },
  // Base JS config
  {
    files: ['**/*.{js,mjs,cjs}'],
    extends: [eslint.configs.recommended],
    languageOptions: {
      globals: {
        ...globals.node
      }
    }
  },
  // TypeScript specific config
  {
    files: ['**/*.{ts,tsx}'],
    extends: [eslint.configs.recommended, ...tseslint.configs.recommended],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      import: importPlugin
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      },
      parser: tseslint.parser,
      parserOptions: {
        project: [
          './tsconfig.json',
          './tsconfig.node.json',
          './tsconfig.web.json'
        ],
        tsconfigRootDir: __dirname
      }
    },
    rules: {
      // Flag deprecated imports via plugin-import
      'import/no-deprecated': 'warn',
      // Disallow deprecated test utils import explicitly
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'react-dom/test-utils',
              message:
                'Deprecated. Import act from react instead: import { act } from "react".'
            }
          ]
        }
      ]
    }
  },
  prettierConfig
)
