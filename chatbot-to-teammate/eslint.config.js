import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    // Slide modules export one `Slide` data object and keep their diagram
    // components local to the file (the part-1 idiom). Fast refresh of a slide
    // module is moot — the Deck renders from the `slides` array — so the
    // component-only-export rule buys nothing here.
    files: ['src/slides/**/*.tsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
])
