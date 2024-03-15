import antfu from '@antfu/eslint-config'

export default antfu({

}, {
  rules: {
    'curly': ['error', 'all'],
    'vue/no-irregular-whitespace': 'warn',
    'vue/max-attributes-per-line': ['error', {
      multiline: {
        max: 1,
      },
      singleline: {
        max: 1,
      },
    }],
  },
})
