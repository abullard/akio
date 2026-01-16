// eslint.config.js
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import unusedImports from 'eslint-plugin-unused-imports';

export default [
    {
        ignores: ['dist/', 'tests/', 'node_modules/', '.github'],
    },

    // TypeScript-aware linting
    ...tseslint.configs.recommended,

    {
        files: ['**/*.ts'],

        languageOptions: {
            parserOptions: {
                tsconfigRootDir: import.meta.dirname,
            },
        },

        plugins: {
            import: importPlugin,
            'unused-imports': unusedImports,
        },

        rules: {
            // --- Signal over noise ---
            'no-console': 'off',

            // --- Imports ---
            'import/order': [
                'warn',
                {
                    groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
                    'newlines-between': 'never',
                },
            ],

            // --- TypeScript hygiene ---
            '@typescript-eslint/no-unused-vars': 'error',
            'unused-imports/no-unused-imports': 'error',

            '@typescript-eslint/consistent-type-imports': ['warn', { prefer: 'type-imports' }],
        },
    },
];
