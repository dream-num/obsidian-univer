import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: ['**/data/**.ts'],
}, {
  rules: {
    'no-new': 'off',
  },
})
