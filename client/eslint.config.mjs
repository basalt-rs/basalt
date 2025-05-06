import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import stylistic from '@stylistic/eslint-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.extends('next/core-web-vitals', 'next/typescript', 'prettier'),
    {
        plugins: {
            '@stylistic': stylistic,
        },
        rules: {
            '@stylistic/jsx-quotes': ['error', 'prefer-double'],
            '@stylistic/jsx-curly-brace-presence': [
                'error',
                {
                    props: 'never',
                    children: 'never',
                    propElementValues: 'always',
                },
            ],
            '@stylistic/jsx-pascal-case': [
                'error',
                {
                    allowAllCaps: false,
                    allowNamespace: true,
                    allowLeadingUnderscore: false,
                },
            ],
            '@stylistic/jsx-self-closing-comp': [
                'error',
                {
                    component: true,
                    html: true,
                },
            ],
        },
    },
    {
        rules: {
            camelcase: [
                'error',
                {
                    ignoreImports: true,
                },
            ],
            eqeqeq: 'error',
            'no-useless-assignment': 'warn',
            'consistent-return': 'error',
            'dot-notation': 'error',
            'no-unneeded-ternary': 'warn',
            'object-shorthand': 'error',
            'prefer-const': 'warn',
            'prefer-destructuring': 'error',
            'no-useless-rename': 'error',
            'no-cond-assign': 'error',
            '@typescript-eslint/no-unused-vars': [
                'error', // Change to 'error' if you want it to be an error
                {
                    args: 'all',
                    argsIgnorePattern: '^_',
                    caughtErrors: 'all',
                    caughtErrorsIgnorePattern: '^_',
                    destructuredArrayIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    ignoreRestSiblings: true,
                },
            ],
        },
    },
    {
        ignores: ['**/*.config*', '.next', 'out'],
    },
];

export default eslintConfig;
