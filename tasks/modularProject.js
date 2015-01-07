/*
 * grunt-modular-project
 * https://github.com/brettuglow/modular-project
 *
 * Copyright (c) 2015 Brett Uglow
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  var cfg = {
    // New config
    options: {
      srcDir: 'testsrc/',
      modulesSubDir: 'modules/',
      moduleAssets: 'assets',
      moduleIncludes: 'includes',
      moduleStyles: 'styles',
      moduleUnitTest: 'unitTest',
      cssRootFiles: [],
      externalCSSFiles: [],
      compiledCSSFiles: [],
      vendor: {
        compilableFiles: [],
        externalFiles: []
      },
      testLibraryFiles: [],
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
        build: ['mpBuildInit', 'mpBuildIncludes', 'mpBuildJS', 'mpBuildCSS', 'mpBuildHTML', 'mpVerify:all'],
        optimise: ['mpBuildSite', 'beep:twobits'], // Appends to the existing task
        release: [] // Appends to the existing task
      },
      git: {
        commitHookFileRelativePath: '',
        commitTemplate: ''
      },
      node: {
        localNodeJSEXEPath: '',
        globalNodeJSXEPath: ''
      },
      release: {
        filesToBump: ['package.json', 'bower.json'],
        filesToCommit: ['package.json', 'bower.json', 'CHANGELOG.md']
      }
    },




    // Old config....
    bowerDir: 'bower_components/',
    config: {
      dir: 'config/',
      gruntFiles: ['Gruntfile.js']
    },
    src: {
      dir: '<%= modularProject.options.srcDir %>',
      modulesDir: '<%= modularProject.src.dir %><%= modularProject.options.modulesSubDir %>',

      assets: {
        dirName: '<%= modularProject.options.moduleAssets %>',
        files: ['**/<%= modularProject.src.assets.dirName %>/**/*']
      },
      css: {
        dir: '<%= modularProject.src.modulesDir %>',
        stylusDirs: '<%= modularProject.src.modulesDir %>**/<%= modularProject.options.moduleStyles %>',   // No trailing '/' - not following pattern
        rootSourceFiles: '<%= modularProject.options.cssRootFiles %>'
      },
      includes: {
        dir: '<%= modularProject.src.modulesDir %>**/<%= modularProject.options.moduleIncludes %>/',
        files: '*'
      },
      js: {
        files: ['<%= modularProject.src.modulesDir %>**/_*.js', '<%= modularProject.src.modulesDir %>**/*.js', '!<%= modularProject.test.specs %>']
      },
      html: {
        dir: '<%= modularProject.src.modulesDir %>',
        files: ['**/*.{html,inc}'] //templates directory needs to be ignored
      },

      templateHTML: {
        dir: '<%= modularProject.src.modulesDir %>',
        files: '**/template/*.html'
      }
    },
    test: {
      specs: '<%= modularProject.src.modulesDir %>**/<%= modularProject.options.moduleUnitTest %>/*.spec.js'
    },
    report: {
      dir: 'reports/'
    },






    build: {
      dev: {
        dir: '<%= modularProject.options.output.devDir %>',
        assetsDir: '<%= modularProject.build.dev.dir %><%= modularProject.options.output.assetsSubDir %>',
        cssDir: '<%= modularProject.build.dev.dir %><%= modularProject.options.output.cssSubDir %>',
        jsDir: '<%= modularProject.build.dev.dir %><%= modularProject.options.output.jsSubDir %>',
        vendorDir: '<%= modularProject.build.dev.dir %><%= modularProject.options.output.vendorSubDir %>',
        viewsDir: '<%= modularProject.build.dev.dir %><%= modularProject.options.output.viewsSubDir %>',
        livereloadFiles: ['<%= modularProject.build.dev.dir %>**/*']
      },
      prod: {
        dir: '<%= modularProject.options.output.prodDir %>'
      },
      temp: {
        dir: '.tmp/'
      }
    },

    buildIncludes: {
      includeTempDir: '<%= modularProject.build.temp.dir %>jsincludes/',
      includeDocRoot: '<%= modularProject.src.modulesDir %>',
      clean: ['<%= modularProject.buildIncludes.includeTempDir %>'],
      copy: {
        files: [
          {expand: true, src: '<%= modularProject.src.includes.dir %><%= modularProject.src.includes.files %>', dest: '<%= modularProject.buildIncludes.includeTempDir %>'}
        ]
      },
      watch: {
        files: ['<%= modularProject.src.includes.dir %><%= modularProject.src.includes.files %>']
      }
    },

    // Specific modules
    buildCSS: {
      compile: {
        sourceDirs: '<%= modularProject.src.css.stylusDirs %>',  // Stylus-specific property
        files: [
          {expand: true, flatten: true, cwd: '<%= modularProject.src.modulesDir %>', src: '<%= modularProject.src.css.rootSourceFiles %>', dest: '<%= modularProject.build.dev.cssDir %>', ext: '.css'}
        ]
      },

      copy: {
        files: [
          {
            expand: true,
            flatten: true,
            src: '<%= modularProject.options.externalCSSFiles %>',
            dest: '<%= modularProject.build.dev.cssDir %>'
          }
        ]
      },

      autoPrefix: {
        files: [
          {expand: true, cwd: '<%= modularProject.build.dev.dir %>css', src: '*.css', dest: '<%= modularProject.build.dev.cssDir %>'}
        ]
      },

      watch: {
        files: ['<%= modularProject.src.modulesDir %>**/<%= modularProject.options.moduleStyles %>/*.styl']
      }
    },

    buildJS: {
      // Common variables
      tempJSDir: '<%= modularProject.build.temp.dir %>js/',
      tempTemplateDir: '<%= modularProject.build.temp.dir %>templates/',
      vendorJSFiles: ['<%= modularProject.options.vendor.compilableFiles %>', '<%= modularProject.options.vendor.externalFiles %>'],

      // Tasks
      clean: ['<%= modularProject.buildJS.tempTemplateDir %>', '<%= modularProject.buildJS.tempJSDir %>', '<%= modularProject.build.dev.vendorDir %>', '<%= modularProject.build.dev.jsDir %>'],

      copy: {
        htmlTemplatesToTemp: {
          files: [
            {expand: true, flatten: false, cwd: '<%= modularProject.src.templateHTML.dir %>', src: '<%= modularProject.src.templateHTML.files %>', dest: '<%= modularProject.buildJS.tempTemplateDir %>'}
          ]
        },
        jsToTemp: {
          files: [
            {expand: true, flatten: false, cwd: '<%= modularProject.src.modulesDir %>', src: ['**/_*.js', '**/*.js', '!**/<%= modularProject.options.moduleUnitTest %>/*.spec.js'], dest: '<%= modularProject.buildJS.tempJSDir %>'}
          ]
        },
        vendorJS: {
          files: [
            {expand: true, flatten: false, src: '<%= modularProject.buildJS.vendorJSFiles %>', dest: '<%= modularProject.build.dev.vendorDir %>'}
          ]
        }
      },

      /* This builds the moduleName.js file into the output/js folder */
      concat: {
        moduleJS: {
          files: [
            {
              expand: true,
              cwd: '<%= modularProject.buildJS.tempJSDir %>',
              src: ['**/_*.js', '**/*.js', '!**/<%= modularProject.options.moduleUnitTest %>/*.spec.js'], // Concat files starting with '_' first
              dest: '<%= modularProject.build.dev.jsDir %>',
              rename: function (dest, src) {
                // Use the source directory(s) to create the destination file name
                // e.g. ui/common/icon.js -> ui/common.js
                //      ui/special/foo.js -> ui/special.js
                //grunt.log.writeln('Concat: ' + src);
                //grunt.log.writeln('------->: ' + src.substring(0, src.lastIndexOf('/')));

                return dest + src.substring(0, src.lastIndexOf('/')) + '.js';
              }
            }
          ]
        }
      },

      // This task-config prepares the templates for use *** within-each-module *** !
      prepareNGTemplates: {
        files: [
          {
            cwd: '<%= modularProject.buildJS.tempTemplateDir %>',  // Using this shortens the URL-key of the template name in the $templateCache
            moduleName: /^(.*)\/template/,    // Use the captured group as the module name
            src: '<%= modularProject.src.templateHTML.files %>',   // The HTML template files
            dest: '<%= modularProject.buildJS.tempJSDir %>'        // Base destination directory
          }
        ]
      },

      includeFilesInJS: {
        sourceFiles: [
          {expand: true, cwd: '<%= modularProject.buildJS.tempJSDir %>', src: '**/*.js', dest: '<%= modularProject.buildJS.tempJSDir %>'}
        ],
        includesDir: '<%= modularProject.buildIncludes.includeTempDir %>'
      },

      watch: {
        allJSSrc: {
          files: ['<%= modularProject.src.modulesDir %>**/*.js', '<%= modularProject.config.gruntFiles %>', '<%= modularProject.test.specs %>']
        },
        jsHtmlTemplates: {
          files: ['<%= modularProject.src.templateHTML.dir %><%= modularProject.src.templateHTML.files %>']
        },
        vendorJS: {
          files: ['<%= modularProject.buildJS.vendorJSFiles %>']
        }
      }
    },

    // Placeholder/Stub config, for the respective tasks (otherwise they complain about missing config)
    buildDocs: {
      src: {},
      dest: {}
    },
    buildLibrary: {},

    buildHTML: {
      html: {
        copy: {
          files: [
            {expand: true, flatten: false, cwd: '<%= modularProject.src.html.dir %>', src: '<%= modularProject.src.html.files %>', dest: '<%= modularProject.build.dev.viewsDir %>'},
            {expand: true, flatten: true, cwd: '<%= modularProject.src.dir %>', src: '*.html', dest: '<%= modularProject.build.dev.dir %>'},
            {expand: true, flatten: false, cwd: '<%= modularProject.src.dir %>', src: 'partials/*', dest: '<%= modularProject.build.dev.viewsDir %>'}
          ]
        },
        watch: [
          '<%= modularProject.src.html.dir %><%= modularProject.src.html.files %>',
          '<%= modularProject.src.dir %>*.html',
          '<%= modularProject.src.dir %>partials/*'
        ],
        filesWithTemplateTags: {
          files: [
            {src: '<%= modularProject.build.dev.dir %>*.html', dest: '<%= modularProject.build.dev.dir %>'}
          ]
        }
      },

      moduleAssets: {
        copy: {
          files: [
            {
              expand: true,
              flatten: false,
              cwd: '<%= modularProject.src.modulesDir %>',
              src: '<%= modularProject.src.assets.files %>',
              dest: '<%= modularProject.build.dev.assetsDir %>',
              rename: function (dest, src) {
                grunt.log.writeln('Copy: ' + src + ', ' + dest);
                // Remove the 'prefix/assets/ portion of the path
                var assetsDirName = '/' + grunt.config('modularProject.src.assets.dirName') + '/';
                var moduleName = src.substr(0, src.indexOf(assetsDirName));
                //grunt.log.ok('module name = ' + moduleName);
                var newPath = src.substr(src.indexOf(assetsDirName) + 8);
                return dest + '/' + moduleName + '/' + newPath;
              }
            }
          ]
        },
        watch: ['<%= modularProject.src.modulesDir %>' + '<%= modularProject.src.assets.files %>']
      },
      vendorJSFiles: '<%= modularProject.options.vendor.compilableFiles %>',
      vendorDir: '<%= modularProject.options.output.vendorSubDir %>',
      externalJSFiles: '<%= modularProject.options.vendor.externalFiles %>',
      compiledCSSFiles: '<%= modularProject.options.compiledCSSFiles %>'
    },


    buildSite: {
      src: {
        dir: '<%= modularProject.build.dev.dir %>',
        cssDir: '<%= modularProject.build.dev.cssDir %>',
        cssFiles: '*.css',
        htmlFiles: ['<%= modularProject.options.output.viewsSubDir %>/**/*.html'],
        imagesDir: '<%= modularProject.build.dev.assetsDir %>images/',
        jsFilesToConcat: [
          '<%= modularProject.build.dev.jsDir %>**/*.js'
        ],
        optimisedAssetFiles: [
          '<%= modularProject.options.output.assetsSubDir %>font/**/*',
          '<%= modularProject.options.output.assetsSubDir %>language/**/*'
        ]
      },

      dest: {
        dir: '<%= modularProject.build.prod.dir %>',
        cssDir: '<%= modularProject.buildSite.dest.dir %><%= modularProject.options.output.cssSubDir %>',
        cssFiles: ['<%= modularProject.buildSite.dest.cssDir %>*.css'],
        filesToRev: [
          '<%= modularProject.buildSite.dest.dir %><%= modularProject.options.output.assetsSubDir %>font/*',
          '<%= modularProject.buildSite.dest.dir %><%= modularProject.options.output.assetsSubDir %>images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= modularProject.buildSite.dest.dir %><%= modularProject.options.output.cssSubDir %>*.css',
          '<%= modularProject.buildSite.dest.dir %><%= modularProject.options.output.jsSubDir %>*.js',
          '<%= modularProject.buildSite.dest.dir %><%= modularProject.options.output.vendorSubDir %>**/*.js'
        ],
        htmlFiles: [
          '<%= modularProject.buildSite.dest.dir %>*.html',
          '<%= modularProject.buildSite.dest.dir %><%= modularProject.options.output.viewsSubDir %>**/*.html'],
        assetDir: '<%= modularProject.buildSite.dest.dir %><%= modularProject.options.output.assetsSubDir %>',
        imagesDir: '<%= modularProject.buildSite.dest.dir %><%= modularProject.options.output.assetsSubDir %>images/',
        jsDir: '<%= modularProject.buildSite.dest.dir %><%= modularProject.options.output.jsSubDir %>',
        jsMinFile: 'app.js'
      },

      vendorJSFiles: '<%= modularProject.options.vendor.compilableFiles %>',
      vendorDir: '<%= modularProject.options.output.vendorSubDir %>',
      externalJSFiles: '<%= modularProject.options.vendor.externalFiles %>',
      compiledCSSFiles: '<%= modularProject.options.compiledCSSFiles %>',

      copy: {
        files: [
          {expand: true, cwd: '<%= modularProject.build.dev.dir %>', src: '<%= modularProject.buildSite.src.optimisedAssetFiles %>', dest: '<%= modularProject.buildSite.dest.dir %>'},
          {expand: true, cwd: '<%= modularProject.build.dev.assetsDir %>', src: '*/{config,language}/**/*', dest: '<%= modularProject.buildSite.dest.assetDir %>'},
          {expand: true, cwd: '<%= modularProject.build.dev.dir %>', src: '<%= modularProject.options.output.vendorSubDir %>**/*', dest: '<%= modularProject.buildSite.dest.dir %>'},
          {expand: true, cwd: '<%= modularProject.buildSite.src.dir %>', src: '<%= modularProject.buildSite.src.htmlFiles %>', dest: '<%= modularProjectConfig.buildDocs.dest.dir %>'},
          {expand: true, cwd: '<%= modularProject.options.srcDir %>', src: '*.html', dest: '<%= modularProjectConfig.buildDocs.dest.dir %>'}
        ]
      },

      targethtml: {
        files: [{src: '<%= modularProject.buildSite.dest.dir %>*.html', dest: '<%= modularProject.buildSite.dest.dir %>'}]
      },

      htmlminFiles: [
        {expand: true, cwd: '<%= modularProject.buildSite.dest.dir %>', src: '<%= modularProject.buildSite.src.htmlFiles %>', dest: '<%= modularProject.buildSite.dest.dir %>'},
        {expand: true, cwd: '<%= modularProject.buildSite.dest.dir %>', src: '*.html', dest: '<%= modularProject.buildSite.dest.dir %>'}
      ]
    },

    serve: {
      dev: {
        baseDir: ['<%= modularProject.build.dev.dir %>'],
        port: 8000,
        hostname: 'localhost'
      },
      prod: {
        baseDir: ['<%= modularProject.build.prod.dir %>'],
        port: 8000,
        hostname: 'localhost'
      }
    },

    unitTest: {
      modulesDir: '<%= modularProject.src.modulesDir %>',
      reportDir: '<%= modularProject.report.dir %>',
      baseConfig: '<%= modularProject.config.dir %>karma/karma.conf.js',
      browserConfig: '<%= modularProject.config.dir %>karma/karma.conf.js',
      CIConfig: '<%= modularProject.config.dir %>karma/karma.conf.js',
      testFiles: [
        '<%= modularProject.options.testLibraryFiles %>',

        // Our source code
        '<%= modularProject.src.modulesDir %>**/_*.js',        // Need to load these next
        '<%= modularProject.src.modulesDir %>**/*.js',         // Then all other source files

        // HTML Templates (which are converted to JS files by ng-html2js
        '<%= modularProject.src.modulesDir %>**/template/*.html',

        // Test specs
        '<%= modularProject.src.modulesDir %>**/<%= modularProject.options.moduleUnitTest %>/*.spec.js'
      ],
      excludeFiles: [
        '<%= modularProject.src.modulesDir %>docs/**/*.js',   // No need to test the docs module
        '<%= modularProject.src.modulesDir %>**/docs/*.js'    // No need to test the docs examples
      ],
      preprocessors: {
        // Source files, that you wanna generate coverage for.
        // Do not include tests or libraries
        // (these files will be instrumented by Istanbul)
//        'src/modules/**/!(*.spec).js': ['coverage'],    // This line must be generated because the src-path is dynamic, but we can't generate it using <%= %>
        '**/*.html': ['ng-html2js']
      }
    },

    release: {
      filesToBump: '<%= modularProject.options.release.filesToBump %>',
      filesToCommit: '<%= modularProject.options.release.filesToCommit %>'
    },

    verify: {
      allFiles: ['<%= modularProject.src.modulesDir %>**/*.js', '<%= modularProject.config.gruntFiles %>', '<%= modularProject.test.specs %>'],
      srcFiles: ['<%= modularProject.src.js.files %>', '<%= modularProject.config.gruntFiles %>'],
      testFiles: ['<%= modularProject.test.specs %>'],
      reportDir: '<%= modularProject.report.dir %>',
      jshint: {
        baseConfig: '<%= modularProject.config.dir %>jshint/.jshintrc',
        testConfig: '<%= modularProject.config.dir %>jshint/.jshintrc',
        CIConfig: '<%= modularProject.config.dir %>jshint/.jshintrc'
      },
      jscs: {
        baseConfig: '<%= modularProject.config.dir %>jscs/.jscsrc',
        testConfig: '<%= modularProject.config.dir %>jscs/.jscsrc',
        CIConfig: '<%= modularProject.config.dir %>jscs/.jscsrc'
      }
    }
  };

  // Initialise the configuration
  (function init() {
    var path = require('path');

    // Load the grunt tasks that this package uses
    //grunt.file.setBase(path.resolve(__dirname + '/../'));
//    require('load-grunt-tasks')(grunt, {config: path.resolve(__dirname + '/../package.json')});
    //grunt.file.setBase(process.cwd());

    grunt.config.set('modularProject', cfg);
//    grunt.log.writeln('1 GruntFiles: ' + grunt.config('modularProject.config.gruntFiles'));
//    grunt.log.writeln('1 Assets: ' + grunt.config('modularProject.src.assets.dirName'));
    //grunt.log.writeln('1 Options: ' + JSON.stringify(options, null, '\t'));

    // Merge the user-overrides in
    var options = grunt.config('modularProjectConfig');
    grunt.config.merge({ modularProject: options });

//    grunt.log.writeln('2 GruntFiles: ' + grunt.config('modularProject.config.gruntFiles'));
//    grunt.log.writeln('2 Assets: ' + grunt.config('modularProject.src.assets.dirName'));

    // Update the unitTest config with a dynamic key
    var preProcessorCoverageKey = '' + grunt.config('modularProject.src.modulesDir') + '**/!(*.spec).js';
    //grunt.log.writeln('Preprocessor key: ' + preProcessorCoverageKey);

    grunt.config.set('modularProject.unitTest.preprocessors.' + grunt.config.escape(preProcessorCoverageKey), ['coverage']);

    //grunt.log.writeln('Preprocessor: ' + JSON.stringify(grunt.config('modularProject.unitTest.preprocessors', null, '\t')));


    grunt.loadTasks(path.resolve(__dirname + '/subTasks'));

//    require(path.resolve(__dirname + '/subTasks/buildCSS'))(grunt);
//    require(path.resolve(__dirname + '/subTasks/buildDocs'))(grunt);
//    require(path.resolve(__dirname + '/subTasks/buildHTML'))(grunt);
//    require(path.resolve(__dirname + '/subTasks/buildIncludes'))(grunt);
//    require(path.resolve(__dirname + '/subTasks/buildInit'))(grunt);
//    require(path.resolve(__dirname + '/subTasks/buildJS'))(grunt);
//    require(path.resolve(__dirname + '/subTasks/buildLibrary'))(grunt);
//    require(path.resolve(__dirname + '/subTasks/buildSite'))(grunt);
//    require(path.resolve(__dirname + '/subTasks/changelog'))(grunt);
//    require(path.resolve(__dirname + '/subTasks/install'))(grunt);
//    require(path.resolve(__dirname + '/subTasks/release'))(grunt);
//    require(path.resolve(__dirname + '/subTasks/releaseDocs'))(grunt);
//    require(path.resolve(__dirname + '/subTasks/serve'))(grunt);
//    require(path.resolve(__dirname + '/subTasks/unitTest'))(grunt);
//    require(path.resolve(__dirname + '/subTasks/verify'))(grunt);
//    require(path.resolve(__dirname + '/subTasks/watch'))(grunt);
  })();



  grunt.registerTask('mpBuild', 'PRIVATE - do not use', function() {
    grunt.log.writeln('mpBuild: ' + grunt.config('modularProject.options.tasks.build'));
    grunt.task.run(grunt.config('modularProject.options.tasks.build'));
  });

  grunt.registerTask('mpBuildUnoptimised', 'PRIVATE - do not use. Create an UN-optimised build', ['mpBuild']);

  grunt.registerTask('mpBuildOptimised', 'PRIVATE - do not use. Create an optimised build', function() {
    var tasks = ['mpBuild'].concat(grunt.config('modularProject.options.tasks.optimise'));
    grunt.log.writeln('mpBuildOptimised: ' + tasks);
    grunt.task.run(tasks);
  });

  grunt.registerTask('mpBuildWatch', 'PRIVATE - do not use. Create an UN-optimised build & watch it.', ['mpBuildUnoptimised', 'mpServe:dev', 'watch']);


  // There are only 2 kinds of builds - development and production (optimized).
  // Unit tests run against development source code (unminified, but concatenated)

  grunt.registerTask('dev', 'Create a dev build then watch for changes', ['mpBuildWatch']);

  grunt.registerTask('build', 'Create a release build', function(target) {
    if (target === 'serve') {
      return grunt.task.run(['mpBuildOptimised', 'mpServe:prod']);
    } else {
      return grunt.task.run(['mpBuildOptimised']);
    }
  });

  grunt.registerTask('default', ['dev']);

};
