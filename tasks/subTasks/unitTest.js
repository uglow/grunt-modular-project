module.exports = function(grunt) {
  'use strict';

  var config = grunt.config.get('modularProject.unitTest');

  grunt.extendConfig({
    coverage: {
      options: {
        thresholds: {
          statements: 80,
          branches: 80,
          lines: 70,  // This should move to 80
          functions: 80
        },
        dir: 'coverage',
        root: config.reportDir
      }
    },
    // Test settings
    karma: {
      options: {
        'files': config.testFiles,
        'exclude': config.excludeFiles,
        'preprocessors': config.preprocessors,
        'coverageReporter': {
          reporters: [
            { type: 'html' },
            { type: 'lcov' },
            { type: 'text' },         // Needed for grunt-istanbul-coverage task
            { type: 'json' }          // Needed for grunt-istanbul-coverage task
          ],
          dir: config.reportDir + 'coverage/'
        },
        'ngHtml2JsPreprocessor': {
          // Define a custom module name function (stripping 'src/modules/' from the file path)
          // which gives you something like:
          //   angular.module('form/template/FormCheckboxTemplate.html', []).run(function($templateCache) {
          //     $templateCache.put('form/template/FormCheckboxTemplate.html',
          //         '<!-- form.controls.checkbox.template -->\n' +
          //         '<div>\n' +
          //         '  <div class="checkbox">\n' +
          //         '    <input type="checkbox" field-error-controller>\n' +
          //         '    <label><span ng-transclude></span></label>\n' +
          //         '  </div>\n' +
          //         '</div>');
          //   });
          cacheIdFromPath: function (filepath) {
            return filepath.substr(config.modulesDir.length);
          }
        }
      },
      unit: {
        configFile: config.baseConfig,
        singleRun: true,
        browsers: ['PhantomJS'],
        reporters: ['progress', 'coverage']
      },
      browser: {
        configFile: config.browserConfig,
        singleRun: false,
        browsers: ['Chrome'],
        reporters: []
      },
      ci: {
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

  grunt.registerTask('test', ['unitTest']);

  grunt.registerTask('test:browser', ['karma:browser']);

  grunt.registerTask('unitTest', 'Run unit tests', function() {
    grunt.task.run(['mpVerify:all', 'karma:ci', 'coverage']);
  });
};
