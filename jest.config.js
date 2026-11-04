/* eslint-disable flowtype/require-valid-file-annotation */

module.exports = {
  setupFilesAfterEnv: ['<rootDir>/test/env-setup.js'],
  // node_modules is default.
  testPathIgnorePatterns: ['/node_modules/'],
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
  verbose: true,
  "transformIgnorePatterns": [
    '/node_modules/(?!@belzile/react-shallow-renderer/)',
  ]
};
