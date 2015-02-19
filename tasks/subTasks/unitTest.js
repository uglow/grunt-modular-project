module.exports = function(grunt) {
  'use strict';

  var config = grunt.config.get('modularProject.unitTest');

  grunt.extendConfig({
    coverage: {
      check: {
        options: config.coverage.options
      }
    },
    // Test settings
    karma: {
      options: config.karma.options,
      unit: {
        files: [{src: config.testFiles }],
        configFile: config.baseConfig,
        singleRun: true,
        browsers: ['PhantomJS'],
        reporters: ['progress', 'coverage']
      },
      browser: {
        files: [{src: config.testFiles }],
        configFile: config.browserConfig,
        singleRun: false,
        browsers: ['Chrome'],
        reporters: []
      },
      ci: {
        files: [{src: config.testFiles }],
        configFile: config.CIConfig,
        singleRun: true,
        browsers: ['PhantomJS'],
        reporters: ['progress', 'junit', 'coverage'],
        junitReporter: {
          outputFile: config.reportDir + 'unit-tests.xml'
        }
      }
    }
  });
};
