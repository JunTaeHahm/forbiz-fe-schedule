module.exports = {
  root: true,
  env: {
    node: true,
  },

  plugins: ['import'],

  extends: [
    'eslint:recommended',
    '@vue/typescript/recommended',
    'plugin:vue/vue3-essential',
    'plugin:vue/vue3-recommended',
    'plugin:prettier/recommended',
    '@vue/eslint-config-prettier',
  ],
  parserOptions: {
    ecmaVersion: 2020,
    parser: '@typescript-eslint/parser',
  },

  rules: {
    'import/order': [
      'warn',
      {
        groups: ['external', 'internal'],
        pathGroups: [
          {
            pattern: 'vue',
            group: 'external',
            position: 'before',
          },
          {
            pattern: '@/services/**',
            group: 'internal',
          },
          {
            pattern: '@/utils/**',
            group: 'internal',
          },
          {
            pattern: '@/configs/**',
            group: 'internal',
          },
          {
            pattern: '@/composables/**',
            group: 'internal',
          },
          {
            pattern: '@/components/**',
            group: 'internal',
          },
          {
            pattern: '@/views/**',
            group: 'internal',
          },
          {
            pattern: '@/stores/**',
            group: 'internal',
          },
          {
            pattern: '@/constants/**',
            group: 'internal',
          },
          {
            pattern: '@/types/**',
            group: 'internal',
          },
          {
            pattern: '@/styles/**',
            group: 'internal',
          },
          {
            pattern: '[./]**',
            group: 'internal',
          },
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
        // 'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',

    'object-shorthand': ['error', 'always'],
    'vue/script-indent': [
      'error',
      2,
      {
        baseIndent: 1,
        switchCase: 1,
      },
    ],
    'vue/html-self-closing': 'off',
    'vue/first-attribute-linebreak': [
      'error',
      {
        singleline: 'ignore',
        multiline: 'below',
      },
    ],
    'vue/no-reserved-props': [
      'error',
      {
        vueVersion: 3, // or 2
      },
    ],

    'vue/valid-define-props': 'off',
    'vue/valid-define-emits': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/attributes-order': [
      'warn',
      {
        order: [
          'DEFINITION', // 'is', 'v-is'
          'LIST_RENDERING', // 'v-for item in items'
          'CONDITIONALS', // 'v-if', 'v-else-if', 'v-else', 'v-show', 'v-cloak'
          'RENDER_MODIFIERS', // 'v-once', 'v-pre'
          'TWO_WAY_BINDING', // 'v-model'
          'ATTR_DYNAMIC', // 'v-bind:prop="foo"', ':prop="foo"'
          'UNIQUE', // 'ref', 'key'
          'GLOBAL', // 'id'
          'SLOT', // 'v-slot', 'slot'.
          'OTHER_DIRECTIVES', // 'v-custom-directive'
          'ATTR_STATIC', // 'prop="foo"', 'custom-prop="foo"'
          'ATTR_SHORTHAND_BOOL', // 'boolean-prop'
          'EVENTS', // '@click="functionCall"', 'v-on="event"'
          'CONTENT', // 'v-text', 'v-html'
        ],
      },
    ],
  },
  overrides: [
    {
      files: ['*.vue'],
      rules: {
        indent: 'off',
      },
    },
  ],
  globals: {
    defineProps: 'readonly',
    defineEmits: 'readonly',
    defineExpose: 'readonly',
  },
};
