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
          prodDir: 'dist/',

          assetsSubDir: 'assets/',
          cssSubDir: 'css/',
          jsSubDir: 'js/',
          vendorSubDir: 'vendor/',
          viewsSubDir: 'views/'
        },
        tasks: {
          optimise: ['mpBuildLibrary', 'mpBuildDocs', 'beep:twobits']
        },
        release: {
          filesToBump: ['package.json'],
          filesToCommit: ['package.json', 'CHANGELOG.md']
        }
      },

      // Custom config for building a JS library - used by the mpBuildLibrary task
      buildLibrary: {
        // Common vars
        libDir: 'lib/',
        libFile: '<%= modularProjectConfig.buildLibrary.libDir %>ng-form-lib.js',
        minLibFile: '<%= modularProjectConfig.buildLibrary.libDir %>ng-form-lib.min.js',

        // Task config
        clean: ['<%= modularProjectConfig.buildLibrary.libDir %>'],

        copy: {
          files: [{expand: true, cwd: '<%= modularProject.build.dev.jsDir %>', src: ['**/*.js', '!**/docs.js'], dest: '<%= modularProjectConfig.buildLibrary.libDir %>src'}]
        },

        concat: {
          files: [{
            src: ['<%= modularProjectConfig.buildLibrary.libDir %>src/**/*.js'],
            dest: '<%= modularProjectConfig.buildLibrary.libFile %>'
          }]
        },

        uglifyFiles: [{src: '<%= modularProjectConfig.buildLibrary.libFile %>', dest: '<%= modularProjectConfig.buildLibrary.minLibFile %>'}]
      },

      // This is a custom config used by the mpBuildDocs task
      buildDocs: {
        src: {
          dir: '<%= modularProject.build.dev.dir %>',
          cssDir: '<%= modularProject.build.dev.cssDir %>',
          cssFiles: '*.css',
          htmlFiles: ['<%= modularProject.options.output.viewsSubDir %>/**/*.html'],
          imagesDir: '<%= modularProject.build.dev.assetsDir %>images/',
          jsFilesToConcat: [
            '<%= modularProject.build.dev.jsDir %>**/docs.js'
          ],
          optimisedAssetFiles: [
            'assets/font/**/*',
            'assets/language/**/*'
          ]
        },

        dest: {
          dir: '<%= modularProject.build.prod.dir %>',
          cssDir: '<%= modularProjectConfig.buildDocs.dest.dir %><%= modularProject.options.output.cssSubDir %>',
          cssFiles: ['<%= modularProjectConfig.buildDocs.dest.cssDir %>*.css'],
          filesToRev: [
            '<%= modularProjectConfig.buildDocs.dest.dir %><%= modularProject.options.output.assetsSubDir %>font/*',
            '<%= modularProjectConfig.buildDocs.dest.dir %><%= modularProject.options.output.assetsSubDir %>images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
            '<%= modularProjectConfig.buildDocs.dest.dir %><%= modularProject.options.output.cssSubDir %>*.css',
            '<%= modularProjectConfig.buildDocs.dest.dir %><%= modularProject.options.output.jsSubDir %>*.js',
            '<%= modularProjectConfig.buildDocs.dest.dir %><%= modularProject.options.output.vendorSubDir %>**/*.js'
          ],
          htmlFiles: [
            '<%= modularProjectConfig.buildDocs.dest.dir %>*.html',
            '<%= modularProjectConfig.buildDocs.dest.dir %><%= modularProject.options.output.viewsSubDir %>**/*.html'
          ],
          assetDir: '<%= modularProjectConfig.buildDocs.dest.dir %><%= modularProject.options.output.assetsSubDir %>',
          imagesDir: '<%= modularProjectConfig.buildDocs.dest.dir %><%= modularProject.options.output.assetsSubDir %>images/',
          jsDir: '<%= modularProjectConfig.buildDocs.dest.dir %><%= modularProject.options.output.jsSubDir %>',
          jsMinFile: 'ng-form-lib-docs.js'
        },

        vendorDir: '<%= modularProjectConfig.options.output.vendorSubDir %>',
        vendorJSFiles: '<%= modularProjectConfig.options.vendor.compilableFiles %>',
        externalJSFiles: '<%= modularProjectConfig.options.vendor.externalFiles %>',
        compiledCSSFiles: '<%= modularProjectConfig.options.compiledCSSFiles %>',

        copy: {
          files: [
            {expand: true, cwd: '<%= modularProject.build.dev.dir %>', src: '<%= modularProjectConfig.buildDocs.src.optimisedAssetFiles %>', dest: '<%= modularProjectConfig.buildDocs.dest.dir %>'},
            {expand: true, flatten: true, src: '<%= modularProjectConfig.buildLibrary.libFile %>', dest: '<%= modularProjectConfig.buildDocs.dest.jsDir %>'},
            {expand: true, cwd: '<%= modularProject.build.dev.assetsDir %>', src: '*/{config,language}/**/*', dest: '<%= modularProjectConfig.buildDocs.dest.assetDir %>'},
            {expand: true, cwd: '<%= modularProject.build.dev.dir %>', src: '<%= modularProject.options.output.vendorSubDir %>**/*', dest: '<%= modularProjectConfig.buildDocs.dest.dir %>'},
            {expand: true, cwd: '<%= modularProjectConfig.buildDocs.src.dir %>', src: '<%= modularProjectConfig.buildDocs.src.htmlFiles %>', dest: '<%= modularProjectConfig.buildDocs.dest.dir %>'},
            {expand: true, cwd: '<%= modularProjectConfig.options.srcDir %>', src: '*.html', dest: '<%= modularProjectConfig.buildDocs.dest.dir %>'}
          ]
        },

        targethtml: {
          files: [{src: '<%= modularProjectConfig.buildDocs.dest.dir %>*.html', dest: '<%= modularProjectConfig.buildDocs.dest.dir %>'}]
        },

        htmlminFiles: [
          {expand: true, cwd: '<%= modularProjectConfig.buildDocs.dest.dir %>', src: '<%= modularProjectConfig.buildDocs.src.htmlFiles %>', dest: '<%= modularProjectConfig.buildDocs.dest.dir %>'},
          {expand: true, cwd: '<%= modularProjectConfig.buildDocs.dest.dir %>', src: '*.html', dest: '<%= modularProjectConfig.buildDocs.dest.dir %>'}
        ]
      }
    }

    /**
     * srcDir:
     * moduleTemplates
     * moduleTests
     * modulePartials
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
