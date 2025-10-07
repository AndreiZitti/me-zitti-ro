module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true
    },
    extends: [
        'eslint:recommended'
    ],
    parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module'
    },
    globals: {
        'gsap': 'readonly',
        'ScrollTrigger': 'readonly',
        'ParticleSystem': 'readonly',
        'ObjectFormation': 'readonly',
        'ScrollController': 'readonly',
        'PerformanceOptimizer': 'readonly'
    },
    rules: {
        'indent': ['error', 4],
        'linebreak-style': ['error', 'unix'],
        'quotes': ['error', 'single'],
        'semi': ['error', 'always'],
        'no-unused-vars': ['warn'],
        'no-console': ['warn'],
        'prefer-const': ['error'],
        'no-var': ['error'],
        'object-shorthand': ['error'],
        'prefer-arrow-callback': ['error'],
        'arrow-spacing': ['error'],
        'no-duplicate-imports': ['error'],
        'no-useless-constructor': ['error'],
        'no-useless-rename': ['error'],
        'rest-spread-spacing': ['error'],
        'template-curly-spacing': ['error']
    }
};