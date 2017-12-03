module.exports = {
    root: true,
    extends: 'airbnb-base',
    env: {
        node: true,
        jest: true,
        es6: true,
    },
    parser: 'babel-eslint',
    parserOptions: {
        sourceType: 'module',
        ecmaVersion: 7,
        ecmaFeatures: {
            classes: true,
            modules: true,
        }
    },
    rules: {
        semi: ['warn', 'never'],
        indent: [
            1,
            4,
            {
                SwitchCase: 1
            }
        ],
        'consistent-return': 0,
        'prefer-rest-params': 0,
        'prefer-template': 0,
        'global-require': 0,
        'generator-star-spacing': 0,
        'comma-dangle': [2, 'only-multiline'],
        'arrow-parens': 0,
        'arrow-body-style': 0,
        'class-methods-use-this': 0,
        'max-len': [1, 120],
        'space-infix-ops': 1,
        'prefer-const': 1,
        'array-callback-return': 1,

        'no-prototype-builtins': 0,
        'no-bitwise': 0,
        'no-useless-return': 0,
        'no-plusplus': 0,
        'no-underscore-dangle': 0,
        'no-lonely-if': 0,
        'no-use-before-define': ['error', 'nofunc'],
        'no-confusing-arrow': 0,
        'no-else-return': 0,
        'no-return-assign': 0,
        'no-mixed-operators': 1,
        'no-unused-vars': 1,
        'no-nested-ternary': 1,
        'no-param-reassign': 1,
        'no-unused-expressions': [
            1,
            {
                allowShortCircuit: true,
                allowTernary: true
            }
        ],
        'no-console': [
            1,
            {
                allow: ['warn', 'error']
            }
        ],

        'import/no-unresolved': 0,
        'import/no-extraneous-dependencies': 0,
        'import/no-absolute-path': 0,
        'import/extensions': 0,
        'import/first': 0,
        'import/prefer-default-export': 0
    },
    globals: {
        require: true,

        // wx
        wx: true,
        App: true,
        Page: true,
        Component: true,
        getApp: true
    }
}
