/*
 * grunt-modular-project
 * https://github.com/brettuglow/modular-project
 *
 * Copyright (c) 2015 Brett Uglow
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

//  // Load the plugin FIRST (this will become grunt.loadNpmTasks('grunt-modular-project')
//  grunt.loadTasks('tasks');

  // Override the default project configuration
  grunt.initConfig({
    // Configuration to be run (and then tested).
    modularProject: {
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
          '<%= modularProject.options.vendor.compilableFiles %>',
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
        libFile: '<%= modularProject.buildLibrary.libDir %>ng-form-lib.js',
        minLibFile: '<%= modularProject.buildLibrary.libDir %>ng-form-lib.min.js',

        // Task config
        clean: ['<%= modularProject.buildLibrary.libDir %>'],

        copy: {
          files: [{expand: true, cwd: '<%= modularProject.build.dev.jsDir %>', src: ['**/*.js', '!**/docs.js'], dest: '<%= modularProject.buildLibrary.libDir %>src'}]
        },

        concat: {
          files: [{
            src: ['<%= modularProject.buildLibrary.libDir %>src/**/*.js'],
            dest: '<%= modularProject.buildLibrary.libFile %>'
          }]
        },

        uglifyFiles: [{src: '<%= modularProject.buildLibrary.libFile %>', dest: '<%= modularProject.buildLibrary.minLibFile %>'}]
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
          cssDir: '<%= modularProject.buildDocs.dest.dir %><%= modularProject.options.output.cssSubDir %>',
          cssFiles: ['<%= modularProject.buildDocs.dest.cssDir %>*.css'],
          filesToRev: [
            '<%= modularProject.buildDocs.dest.dir %><%= modularProject.options.output.assetsSubDir %>font/*',
            '<%= modularProject.buildDocs.dest.dir %><%= modularProject.options.output.assetsSubDir %>images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
            '<%= modularProject.buildDocs.dest.dir %><%= modularProject.options.output.cssSubDir %>*.css',
            '<%= modularProject.buildDocs.dest.dir %><%= modularProject.options.output.jsSubDir %>*.js',
            '<%= modularProject.buildDocs.dest.dir %><%= modularProject.options.output.vendorSubDir %>**/*.js'
          ],
          htmlFiles: [
            '<%= modularProject.buildDocs.dest.dir %>*.html',
            '<%= modularProject.buildDocs.dest.dir %><%= modularProject.options.output.viewsSubDir %>**/*.html'
          ],
          assetDir: '<%= modularProject.buildDocs.dest.dir %><%= modularProject.options.output.assetsSubDir %>',
          imagesDir: '<%= modularProject.buildDocs.dest.dir %><%= modularProject.options.output.assetsSubDir %>images/',
          jsDir: '<%= modularProject.buildDocs.dest.dir %><%= modularProject.options.output.jsSubDir %>',
          jsMinFile: 'ng-form-lib-docs.js'
        },

        vendorDir: '<%= modularProject.options.output.vendorSubDir %>',
        vendorJSFiles: '<%= modularProject.options.vendor.compilableFiles %>',
        externalJSFiles: '<%= modularProject.options.vendor.externalFiles %>',
        compiledCSSFiles: '<%= modularProject.options.compiledCSSFiles %>',

        copy: {
          files: [
            {expand: true, cwd: '<%= modularProject.build.dev.dir %>', src: '<%= modularProject.buildDocs.src.optimisedAssetFiles %>', dest: '<%= modularProject.buildDocs.dest.dir %>'},
            {expand: true, flatten: true, src: '<%= modularProject.buildLibrary.libFile %>', dest: '<%= modularProject.buildDocs.dest.jsDir %>'},
            {expand: true, cwd: '<%= modularProject.build.dev.assetsDir %>', src: '*/{config,language}/**/*', dest: '<%= modularProject.buildDocs.dest.assetDir %>'},
            {expand: true, cwd: '<%= modularProject.build.dev.dir %>', src: '<%= modularProject.options.output.vendorSubDir %>**/*', dest: '<%= modularProject.buildDocs.dest.dir %>'},
            {expand: true, cwd: '<%= modularProject.buildDocs.src.dir %>', src: '<%= modularProject.buildDocs.src.htmlFiles %>', dest: '<%= modularProject.buildDocs.dest.dir %>'},
            {expand: true, cwd: '<%= modularProject.options.srcDir %>', src: '*.html', dest: '<%= modularProject.buildDocs.dest.dir %>'}
          ]
        },

        targethtml: {
          files: [{src: '<%= modularProject.buildDocs.dest.dir %>*.html', dest: '<%= modularProject.buildDocs.dest.dir %>'}]
        },

        htmlminFiles: [
          {expand: true, cwd: '<%= modularProject.buildDocs.dest.dir %>', src: '<%= modularProject.buildDocs.src.htmlFiles %>', dest: '<%= modularProject.buildDocs.dest.dir %>'},
          {expand: true, cwd: '<%= modularProject.buildDocs.dest.dir %>', src: '*.html', dest: '<%= modularProject.buildDocs.dest.dir %>'}
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


//
  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // By default, lint and run all tests.
  //grunt.registerTask('default', ['jshint', 'test']);
  grunt.registerTask('default', ['dev']);

};
