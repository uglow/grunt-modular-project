/*
 * grunt-modular-project
 * https://github.com/brettuglow/modular-project
 *
 * Copyright (c) 2015 Brett Uglow
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);


  grunt.initConfig({
    // Configuration to be run (and then tested).
    modularProject: {
      input: {
        srcDir: 'testsrc/',
        modulesDir: 'testsrc/modules/',
        moduleAssets: 'assets',
        moduleIncludes: 'includes',
        modulePartials: 'partials',
        moduleStyles: 'styles',
        moduleTemplates: 'template',
        moduleUnitTest: 'unitTest'
      },
      output: {
        devDir: 'dev/',
        prodDir: 'dist/',
        assetsSubDir: 'assets/',
        cssSubDir: 'css/',
        jsSubDir: 'js/',
        vendorJSSubDir: 'vendor/',
        viewsSubDir: 'views/'
      },


      buildCSS: {
        rootSourceFiles:  ['**/styles/docs.styl', '**/styles/sampleFormStyle.styl'],
        externalCSSFiles: [
          '<%= modularProject.bowerDir %>angular-motion/dist/angular-motion.css',
          '<%= modularProject.bowerDir %>highlightjs/styles/github.css'
        ]
      },

      buildHTML: {
        compiledCSSFiles: [
          'css/angular-motion.css',
          'css/github.css',
          'css/docs.css',
          'css/sampleFormStyle.css'
        ],
        compilableVendorJSFiles: [
          // Order is important - Angular should come first
          '<%= modularProject.bowerDir %>angular/angular.js',
          '<%= modularProject.bowerDir %>angular-animate/angular-animate.js',
          '<%= modularProject.bowerDir %>angular-translate/angular-translate.js',
          '<%= modularProject.bowerDir %>angular-translate-loader-static-files/angular-translate-loader-static-files.js',
          '<%= modularProject.bowerDir %>angular-scroll/angular-scroll.js',
          '<%= modularProject.bowerDir %>angular-strap/dist/angular-strap.js',
          '<%= modularProject.bowerDir %>angular-strap/dist/angular-strap.tpl.js'
        ],
        nonCompilableVendorJSFiles: [
          '<%= modularProject.bowerDir %>highlightjs/highlight.pack.js'
        ]
      },

      optimise: {
        tasks: [
          'mpBuildLibrary',
          'clean:optimised',
          'concurrent:optimisedImages',
          'copy:optimised',
          'concat:optimised', 'uglify:optimised',
          'mpOptimiseHTMLTags', 'targethtml:optimised',
          'filerev:optimised', 'useminOptimised',
          'htmlmin:optimised', 'usebanner'
        ],

        // Modify the optimise task so that it builds the docs.js files together, and copies the library JS file to the output
        // Also need to disable whitespace escaping due to the use of <pre><code> blocks (can't get htmlmin to ignroe blocks at the moment)
        jsMinFile: 'ng-form-lib-docs.js',
        jsFilesToConcat: ['<%= modularProject.build.dev.jsDir %>**/docs.js'],
        filesToCopy: [{expand: true, flatten: true, src: '<%= modularProject.buildLibrary.libFile %>', dest: '<%= modularProject.optimise.dest.jsDir %>'}],
        htmlmin: {
          options: {
            collapseWhitespace: false
          }
        },
        // A banner to apply to the distributed source code
        banner: '/*\n Copyright 2014-2015 grunt-modular-project project contributors (see CONTRIBUTORS.md).\n Licenced under MIT licence (see LICENCE-MIT)\n */\n',
        bannerFiles: ['<%= modularProject.optimise.dest.cssDir %>docs*.css', '<%= modularProject.optimise.dest.dir %><%= modularProject.output.jsSubDir %>*.js']
      },


      // Custom config for building a JS library - used by the mpBuildLibrary task
      buildLibrary: {
        libFileNamePrefix: 'ng-form-lib',
        libSrcFiles: ['**/*.js', '!**/docs.js']
      },

      release: {
        filesToBump: ['package.json'],
        filesToCommit: ['package.json', 'CHANGELOG.md']
      },

      unitTest: {
        testLibraryFiles: [
          '<%= modularProject.buildHTML.compilableVendorJSFiles %>',
          '<%= modularProject.bowerDir %>angular-mocks/angular-mocks.js'
        ],

        coverage: {
          options: {
            thresholds: {
              statements: 80,
              branches: 75,
              lines: 80,
              functions: 80
            }
          }
        }
      }
    }
  });



  // jit-grunt saves about 3 seconds per cycle now - valuable!
  require('jit-grunt')(grunt, {
    ngtemplates: 'grunt-angular-templates',
    includereplace: 'grunt-include-replace',
    coverage: 'grunt-istanbul-coverage',
    usebanner: 'grunt-banner',
    'bump-only': 'grunt-bump'
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  grunt.registerTask('default', ['dev']);
};
