const { defineConfig } = require('vitest/config');

module.exports = defineConfig({
  test: {
    environment: 'node',
    include: ['**/tests/**/*.spec.js'],
    exclude: ['node_modules'],
    globals: true,
  },
  resolve: {
    extensions: ['.js'],
  },
});
