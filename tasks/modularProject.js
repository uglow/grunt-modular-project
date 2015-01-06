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
    buildTasks: ['mpBuildInit', 'mpBuildIncludes', 'mpBuildJS', 'mpBuildCSS', 'mpBuildHTML', 'mpVerify:all'],
    optimiseTasks: ['mpBuildLibrary', 'mpBuildDocs', 'beep:twobits'],

    // Old config....
    bowerDir: 'bower_components/',
    config: {
      dir: 'config/',
      gruntFiles: ['Gruntfile.js']
    },
    git: {
      commitHookFileRelativePath: '',
      commitTemplate: ''
    },
    src: {
      dir: 'src/',
      assets: {
        dirName: 'assets',
        files: ['**/<%= modularProject.src.assets.dirName %>/**/*']
      },
      css: {
        dir: '<%= modularProject.src.modules.dir %>',
        dirName: 'styles',
        stylusDirs: '<%= modularProject.src.modules.dir %>**/<%= modularProject.src.css.dirName %>',   // No trailing '/' - not following pattern
        rootSourceFiles: []
      },
      includes: {
        dir: '<%= modularProject.src.modules.dir %>**/includes/',
        files: '*'
      },
      js: {
        dir: '<%= modularProject.src.modules.dir %>',
        files: ['<%= modularProject.src.js.dir %>**/_*.js', '<%= modularProject.src.js.dir %>**/*.js', '!<%= modularProject.test.specs %>']
      },
      jsLib: {
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
      html: {
        dir: '<%= modularProject.src.modules.dir %>',
        files: ['**/*.{html,inc}'] //templates directory needs to be ignored
      },
      modules: {
        dir: '<%= modularProject.src.dir %>modules/'
      },
      templateHTML: {
        dir: '<%= modularProject.src.modules.dir %>',
        files: '**/template/*.html'
      }
    },
    test: {
      specs: '<%= modularProject.src.modules.dir %>**/unitTest/*.spec.js'
    },
    report: {
      dir: 'reports/'
    },

    build: {
      dev: {
        dir: 'dev/',
        assetsDir: '<%= modularProject.build.dev.dir %>assets/',
        cssDir: '<%= modularProject.build.dev.dir %>css/',
        jsDir: '<%= modularProject.build.dev.dir %>js/',
        vendorDir: '<%= modularProject.build.dev.dir %>vendor/',
        viewsDir: '<%= modularProject.build.dev.dir %>views/',
        livereloadFiles: ['<%= modularProject.build.dev.dir %>**/*']
      },
      prod: {
        dir: 'dist/'
      },
      doc: {
        dir: 'docs/'
      },
      temp: {
        dir: '.tmp/'
      }
    },

    buildIncludes: {
      includeTempDir: '<%= modularProject.build.temp.dir %>jsincludes/',
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
          {expand: true, flatten: true, cwd: '<%= modularProject.src.modules.dir %>', src: '<%= modularProject.src.css.rootSourceFiles %>', dest: '<%= modularProject.build.dev.cssDir %>', ext: '.css'}
        ]
      },

      copy: {
        files: [
          {
            expand: true,
            flatten: true,
            src: [
              '<%= modularProject.bowerDir %>angular-motion/dist/angular-motion.css',
              '<%= modularProject.bowerDir %>highlightjs/styles/github.css'
            ],
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
        files: ['<%= modularProject.src.modules.dir %>**/<%= modularProject.src.css.dirName %>/*.styl']
      }
    },

    buildJS: {
      // Common variables
      tempJSDir: '<%= modularProject.build.temp.dir %>js/',
      tempTemplateDir: '<%= modularProject.build.temp.dir %>templates/',
      vendorJSFiles: ['<%= modularProject.src.jsLib.compilableFiles %>', '<%= modularProject.src.jsLib.externalFiles %>'],

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
            {expand: true, flatten: false, cwd: '<%= modularProject.src.js.dir %>', src: ['**/_*.js', '**/*.js', '!**/unitTest/*.spec.js'], dest: '<%= modularProject.buildJS.tempJSDir %>'}
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
              src: ['**/_*.js', '**/*.js', '!**/unitTest/*.spec.js'], // Concat files starting with '_' first
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
          files: ['<%= modularProject.src.js.dir %>**/*.js', '<%= modularProject.config.gruntFiles %>', '<%= modularProject.test.specs %>']
        },
        jsHtmlTemplates: {
          files: ['<%= modularProject.src.templateHTML.dir %><%= modularProject.src.templateHTML.files %>']
        },
        vendorJS: {
          files: ['<%= modularProject.buildJS.vendorJSFiles %>']
        }
      }
    },


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
              cwd: '<%= modularProject.src.modules.dir %>',
              src: '<%= modularProject.src.assets.files %>',
              dest: '<%= modularProject.build.dev.assetsDir %>',
              rename: function (dest, src) {
                grunt.log.writeln('Copy: ' + src + ', ' + dest);
                // Remove the 'prefix/assets/ portion of the path
                var moduleName = src.substr(0, src.indexOf('/assets/'));
                //grunt.log.ok('module name = ' + moduleName);
                var newPath = src.substr(src.indexOf('/assets/') + 8);
                return dest + '/' + moduleName + '/' + newPath;
              }
            }
          ]
        },
        watch: ['<%= modularProject.src.modules.dir %>' + '<%= modularProject.src.assets.files %>']
      },
      vendorJSFiles: '<%= modularProject.src.jsLib.compilableFiles %>',
      externalJSFiles: '<%= modularProject.src.jsLib.externalFiles %>',

      compiledCSSFiles: [
        'css/angular-motion.css',
        'css/github.css',
        'css/docs.css',
        'css/sampleFormStyle.css'
      ]
    },

    library: {
      // Common vars
      libFile: 'dist/ng-form-lib.js',
      minLibFile: 'dist/ng-form-lib.min.js',

      // Task config
      clean: ['dist/'],

      copy: {
        files: [
          {
            expand: true, cwd: '<%= modularProject.build.dev.jsDir %>', src: ['**/*.js', '!**/docs.js'], dest: 'dist/src'
          }
        ]
      },

      concat: {
        files: [
          {
            src: ['dist/src/**/*.js'],
            dest: '<%= modularProject.library.libFile %>'
          }
        ]
      },

      uglify: {
        files: [
          {
            src: '<%= modularProject.library.libFile %>', dest: '<%= modularProject.library.minLibFile %>'
          }
        ]
      }
    },

    optimise: {
      copy: {
        files: [
          {expand: true, cwd: '<%= modularProject.optimise.src.dir %>', src: '<%= modularProject.optimise.src.optimisedAssetFiles %>', dest: '<%= modularProject.optimise.dest.dir %>'},
          {expand: true, flatten: true, src: '<%= modularProject.library.libFile %>', dest: '<%= modularProject.optimise.dest.dir %>js/'},
          {expand: true, cwd: '<%= modularProject.optimise.src.dir %>assets/', src: '*/{config,language}/**/*', dest: '<%= modularProject.optimise.dest.dir %>assets/'},
          {expand: true, cwd: '<%= modularProject.optimise.src.dir %>', src: 'vendor/**/*', dest: '<%= modularProject.optimise.dest.dir %>'}
        ]
      },

      src: {
        dir: '<%= modularProject.build.dev.dir %>',
        cssDir: '<%= modularProject.optimise.src.dir %>css/',
        cssFiles: '*.css',
        htmlFiles: ['views/**/*.html'],
        imagesDir: '<%= modularProject.optimise.src.dir %>assets/images/',
        jsFilesToConcat: [
          '<%= modularProject.build.dev.jsDir %>**/docs.js'
        ],
        optimisedAssetFiles: [
          'assets/font/**/*',
          'assets/language/**/*'
        ],
        rootHtmlFiles: '*.html',
        rootHtmlFilesDir: '<%= modularProject.src.dir %>'
      },
      dest: {
        dir: '<%= modularProject.build.doc.dir %>',
        cssDir: '<%= modularProject.optimise.dest.dir %>css/',
        cssFiles: ['<%= modularProject.optimise.dest.cssDir %>*.css'],
        filesToRev: [
          '<%= modularProject.optimise.dest.dir %>assets/font/*',
          '<%= modularProject.optimise.dest.dir %>assets/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= modularProject.optimise.dest.dir %>css/*.css',
          '<%= modularProject.optimise.dest.dir %>js/*.js',
          '<%= modularProject.optimise.dest.dir %>vendor/**/*.js'
        ],
        htmlFiles: ['<%= modularProject.optimise.dest.dir %>*.html', '<%= modularProject.optimise.dest.dir %>views/**/*.html'],
        imagesDir: '<%= modularProject.optimise.dest.dir %>assets/images/',
        jsDir: '<%= modularProject.optimise.dest.dir %>js/',
        jsMinFile: 'ng-form-lib-docs.js',
        rootFilesDir: '<%= modularProject.optimise.dest.dir %>',
        rootHtmlFiles: '*.html'
      }
    },

    serve: {
      dev: {
        baseDir: ['<%= modularProject.build.dev.dir %>'],
        port: 8000,
        hostname: 'localhost'
      },
      prod: {
        baseDir: ['<%= modularProject.build.doc.dir %>'],
        port: 8000,
        hostname: 'localhost'
      }
    },

    unitTest: {
      reportDir: '<%= modularProject.report.dir %>',
      baseConfig: '<%= modularProject.config.dir %>karma/karma.conf.js',
      browserConfig: '<%= modularProject.config.dir %>karma/karma.conf.js',
      CIConfig: '<%= modularProject.config.dir %>karma/karma.conf.js',
      testFiles: [
        '<%= modularProject.src.jsLib.compilableFiles %>',
        '<%= modularProject.bowerDir %>angular-mocks/angular-mocks.js',

        // Our source code
        '<%= modularProject.src.modules.dir %>**/_*.js',        // Need to load these next
        '<%= modularProject.src.modules.dir %>**/*.js',         // Then all other source files

        // HTML Templates (which are converted to JS files by ng-html2js
        '<%= modularProject.src.modules.dir %>**/template/*.html',

        // Test specs
        '<%= modularProject.src.modules.dir %>**/unitTest/*.spec.js'
      ],
      excludeFiles: [
        '<%= modularProject.src.modules.dir %>docs/**/*.js',   // No need to test the docs module
        '<%= modularProject.src.modules.dir %>**/docs/*.js'    // No need to test the docs examples
      ],
      preprocessors: {
        // Source files, that you wanna generate coverage for.
        // Do not include tests or libraries
        // (these files will be instrumented by Istanbul)
        'src/modules/**/!(*.spec).js': ['coverage'],
        '**/*.html': ['ng-html2js']
      }
    },

    release: {
      filesToBump: ['package.json', 'bower.json'],
      filesToCommit: ['package.json', 'bower.json', 'CHANGELOG.md']
    },

    verify: {
      allFiles: ['<%= modularProject.src.js.dir %>**/*.js', '<%= modularProject.config.gruntFiles %>', '<%= modularProject.test.specs %>'],
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

  grunt.config.set('modularProject', cfg);

  var options = grunt.config.get('modularProjectConfig');

  grunt.log.writeln('1 GruntFiles: ' + grunt.config('modularProject.config.gruntFiles'));
  grunt.log.writeln('1 Assets: ' + grunt.config('modularProject.src.assets.dirName'));
  //grunt.log.writeln('1 Options: ' + JSON.stringify(options, null, '\t'));

  grunt.config.merge({ modularProject: options });

  grunt.log.writeln('2 GruntFiles: ' + grunt.config('modularProject.config.gruntFiles'));
  grunt.log.writeln('2 Assets: ' + grunt.config('modularProject.src.assets.dirName'));


  grunt.loadTasks('tasks/subTasks');


  grunt.registerTask('mpBuild', 'PRIVATE - do not use', function() {
    grunt.log.writeln('mpBuild: ' + grunt.config('modularProject.buildTasks'));
    grunt.task.run(grunt.config('modularProject.buildTasks'));
  });

  grunt.registerTask('mpBuildUnoptimised', 'PRIVATE - do not use. Create an UN-optimised build', ['mpBuild']);

  grunt.registerTask('mpBuildOptimised', 'PRIVATE - do not use. Create an optimised build', function() {
    var tasks = ['mpBuild'].concat(grunt.config('modularProject.optimiseTasks'));
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
