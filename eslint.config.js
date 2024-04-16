import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: ['**/data/**.ts'],
}, {
  rules: {
    'no-new': 'off',
    'ts/ban-ts-comment': 'off',
  },
})
