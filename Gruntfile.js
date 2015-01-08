/*
 * grunt-modular-project
 * https://github.com/brettuglow/modular-project
 *
 * Copyright (c) 2015 Brett Uglow
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  grunt.initConfig({
    // Configuration to be run (and then tested).
    modularProject: {
      input: {
        srcDir: 'testsrc/',
        modulesSubDir: 'modules/',
        moduleAssets: 'assets',
        moduleIncludes: 'includes',
        modulePartials: 'partials',
        moduleStyles: 'styles',
        moduleTemplates: 'template',
        moduleTest: 'unitTest'
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

      // Custom config for building a JS library - used by the mpBuildLibrary task
      buildLibrary: {
        libFileNamePrefix: 'ng-form-lib',
        libSrcFiles: ['**/*.js', '!**/docs.js']
      },

      release: {
        filesToBump: ['package.json'],
        filesToCommit: ['package.json', 'CHANGELOG.md']
        //tasks: ['releaseDocs']
      },

      optimise: {
        tasks: ['mpBuildLibrary', 'mpBuildDocs', 'beep:twobits']
      },

      unitTest: {
        testLibraryFiles: [
          '<%= modularProject.buildHTML.compilableVendorJSFiles %>',
          '<%= modularProject.bowerDir %>angular-mocks/angular-mocks.js'
        ]
      }
    }
  });


  require('load-grunt-tasks')(grunt);

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // By default, lint and run all tests.
  //grunt.registerTask('default', ['jshint', 'test']);
  grunt.registerTask('default', ['dev']);

};
