/*
 * grunt-modular-project
 * https://github.com/brettuglow/modular-project
 *
 * Copyright (c) 2015 Brett Uglow
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    // Configuration to be run (and then tested).
    modularProjectConfig: {
      options: {
        srcDir: 'testsrc/',
        modulesSubDir: 'modules/',
        moduleAssets: 'assets',
        moduleIncludes: 'includes',
        moduleStyles: 'styles',
        cssRootFiles: ['**/styles/docs.styl', '**/styles/sampleFormStyle.styl'],
        externalCSSFiles: [
          '<%= modularProject.bowerDir %>angular-motion/dist/angular-motion.css',
          '<%= modularProject.bowerDir %>highlightjs/styles/github.css'
        ],
        compiledCSSFiles: [
          'css/angular-motion.css',
          'css/github.css',
          'css/docs.css',
          'css/sampleFormStyle.css'
        ],
        vendor: {
          compilableFiles: [
            // Order is important - Angular should come first
            '<%= modularProject.bowerDir %>angular/angular.js',
            '<%= modularProject.bowerDir %>angular-animate/angular-animate.js',
            '<%= modularProject.bowerDir %>angular-translate/angular-translate.js',
            '<%= modularProject.bowerDir %>angular-translate-loader-static-files/angular-translate-loader-static-files.js',
            '<%= modularProject.bowerDir %>angular-scroll/angular-scroll.js',
            '<%= modularProject.bowerDir %>angular-strap/dist/angular-strap.js',
            '<%= modularProject.bowerDir %>angular-strap/dist/angular-strap.tpl.js'
          ],
          externalFiles: [
            '<%= modularProject.bowerDir %>highlightjs/highlight.pack.js'
          ]
        },
        testLibraryFiles: [
          '<%= modularProjectConfig.options.vendor.compilableFiles %>',
          '<%= modularProject.bowerDir %>angular-mocks/angular-mocks.js'
        ],
        output: {
          devDir: 'dev/',
          prodDir: 'dev/',
          docsDir: 'docs/',

          assetsSubDir: 'assets/',
          cssSubDir: 'css/',
          jsSubDir: 'js/',
          vendorSubDir: 'vendor/',
          viewsSubDir: 'views/'
        }
      }
    }

    /**
     * srcDir:
     * moduleStyles:
     * moduleIncludes
     * moduleTemplates
     * moduleTests
     * modulePartials
     *
     * devDir:
     * prodDir:
     * docDir:
     *
     * reportsDir
     */
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // By default, lint and run all tests.
  //grunt.registerTask('default', ['jshint', 'test']);
  grunt.registerTask('default', ['dev']);

};
