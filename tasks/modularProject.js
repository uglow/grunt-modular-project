/*
 * grunt-modular-project
 * https://github.com/brettuglow/modular-project
 *
 * Copyright (c) 2015 Brett Uglow
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-extend-config');

  var cfg = {
    // Global config that will probably never change
    bowerDir: 'bower_components/',
    config: {
      dir: 'config/',
      gruntFiles: ['Gruntfile.js']
    },

    input: {
      srcDir: 'src/',
      modulesDir: 'src/modules/',
      moduleAssets: 'assets',
      moduleIncludes: 'includes',
      modulePartials: 'partials',
      moduleStyles: 'styles',
      moduleTemplates: 'template',
      moduleUnitTest: 'unitTest',

      assetFiles: ['**/<%= modularProject.input.moduleAssets %>/**/*'],
      htmlFiles: ['**/*.html'], //templates directory needs to be ignored
      jsFiles: ['**/_*.js', '**/*.js'],
      templateHTMLFiles: ['**/<%= modularProject.input.moduleTemplates %>/*.html']
    },
    output: {
      devDir: 'dev/',
      prodDir: 'dist/',
      reportDir: 'reports/',
      assetsSubDir: 'assets/',
      cssSubDir: 'css/',
      jsSubDir: 'js/',
      vendorJSSubDir: 'vendor/',
      viewsSubDir: 'views/'
    },


    install: {
      git: {
        commitHookFileRelativePath: '',
        commitTemplate: ''
      },
      node: {
        localNodeJSEXEPath: '',
        globalNodeJSXEPath: ''
      }
    },


    build: {
      tasks: ['mpBuildInit', 'mpBuildIncludes', 'mpBuildJS', 'mpBuildCSS', 'mpBuildHTML', 'mpVerify:all'],
      dev: {
        dir: '<%= modularProject.output.devDir %>',
        assetsDir: '<%= modularProject.build.dev.dir %><%= modularProject.output.assetsSubDir %>',
        cssDir: '<%= modularProject.build.dev.dir %><%= modularProject.output.cssSubDir %>',
        jsDir: '<%= modularProject.build.dev.dir %><%= modularProject.output.jsSubDir %>',
        vendorJSDir: '<%= modularProject.build.dev.dir %><%= modularProject.output.vendorJSSubDir %>',
        viewsDir: '<%= modularProject.build.dev.dir %><%= modularProject.output.viewsSubDir %>',
        livereloadFiles: ['<%= modularProject.build.dev.dir %>**/*']
      },
      prod: {
        dir: '<%= modularProject.output.prodDir %>'
      },
      temp: {
        dir: '.tmp/'
      }
    },


    buildIncludes: {
      // Public config
      includeTempDir: '<%= modularProject.build.temp.dir %>jsincludes/',
      includeDocRoot: '<%= modularProject.input.modulesDir %>',
      files: ['<%= modularProject.input.modulesDir %>**/<%= modularProject.input.moduleIncludes %>/*'],

      // Private config
      clean: ['<%= modularProject.buildIncludes.includeTempDir %>'],
      copy: {
        files: [{expand: true, src: ['<%= modularProject.buildIncludes.files %>'], dest: '<%= modularProject.buildIncludes.includeTempDir %>'}]
      },
      watch: {
        files: ['<%= modularProject.buildIncludes.files %>']
      }
    },

    // Specific modules
    buildCSS: {
      // Public config
      rootSourceFiles: [],
      externalCSSFiles: [],
      sourceDir: '**/<%= modularProject.input.moduleStyles %>',  // No trailing '/' - not following pattern!

      compile: {
        sourceDirs: '<%= modularProject.input.modulesDir %><%= modularProject.buildCSS.sourceDir %>',  // Stylus-specific property
        files: [
          {expand: true, flatten: true, cwd: '<%= modularProject.input.modulesDir %>', src: '<%= modularProject.buildCSS.rootSourceFiles %>', dest: '<%= modularProject.build.dev.cssDir %>', ext: '.css'}
        ]
      },

      copy: {
        files: [
          {
            expand: true,
            flatten: true,
            src: '<%= modularProject.buildCSS.externalCSSFiles %>',
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
        files: ['<%= modularProject.input.modulesDir %>**/<%= modularProject.input.moduleStyles %>/*.styl']
      }
    },

    buildJS: {
      // Common variables
      tempJSDir: '<%= modularProject.build.temp.dir %>js/',
      tempTemplateDir: '<%= modularProject.build.temp.dir %><%= modularProject.input.moduleTemplates %>/',
      vendorJSFiles: ['<%= modularProject.buildHTML.compilableVendorJSFiles %>', '<%= modularProject.buildHTML.nonCompilableVendorJSFiles %>'],

      // Tasks
      clean: ['<%= modularProject.buildJS.tempTemplateDir %>', '<%= modularProject.buildJS.tempJSDir %>', '<%= modularProject.build.dev.vendorJSDir %>', '<%= modularProject.build.dev.jsDir %>'],

      copy: {
        htmlTemplatesToTemp: {
          files: [
            {expand: true, flatten: false, cwd: '<%= modularProject.input.modulesDir %>', src: '<%= modularProject.input.templateHTMLFiles %>', dest: '<%= modularProject.buildJS.tempTemplateDir %>'}
          ]
        },
        jsToTemp: {
          files: [
            {expand: true, flatten: false, cwd: '<%= modularProject.input.modulesDir %>', src: ['<%= modularProject.input.jsFiles %>', '!<%= modularProject.unitTest.specs %>'], dest: '<%= modularProject.buildJS.tempJSDir %>'}
          ]
        },
        vendorJS: {
          files: [
            {expand: true, flatten: false, src: '<%= modularProject.buildJS.vendorJSFiles %>', dest: '<%= modularProject.build.dev.vendorJSDir %>'}
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
              src: ['<%= modularProject.input.jsFiles %>', '!<%= modularProject.unitTest.specs %>'], // Concat files starting with '_' first, ignore test specs
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
            moduleName: '^(.*)\/<%= modularProject.input.moduleTemplates %>',    // Use the captured group as the module name
            src: '<%= modularProject.input.templateHTMLFiles %>',   // The HTML template files
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
          files: [
            '<%= modularProject.input.modulesDir %>**/*.js',
            '<%= modularProject.config.gruntFiles %>',
            '<%= modularProject.input.modulesDir %><%= modularProject.unitTest.specs %>']
        },
        jsHtmlTemplates: {
          files: ['<%= modularProject.input.modulesDir %><%= modularProject.input.templateHTMLFiles %>']
        },
        vendorJS: {
          files: ['<%= modularProject.buildJS.vendorJSFiles %>']
        }
      }
    },


    buildDocs: {
      // Public config
      preOptimisedAssetFiles: [
        '*/font/**/*',
        '*/language/**/*',
        '*/config/**/*'
      ],
      jsMinFile: 'ng-form-lib-docs.js',

      // Private config
      src: {
        dir: '<%= modularProject.build.dev.dir %>',
        cssDir: '<%= modularProject.build.dev.cssDir %>',
        cssFiles: '*.css',
        htmlFiles: ['<%= modularProject.output.viewsSubDir %>/**/*.html'],
        imagesDir: '<%= modularProject.build.dev.assetsDir %>images/',
        jsFilesToConcat: [
          '<%= modularProject.build.dev.jsDir %>**/docs.js'
        ]
      },

      dest: {
        dir: '<%= modularProject.build.prod.dir %>',
        cssDir: '<%= modularProject.buildDocs.dest.dir %><%= modularProject.output.cssSubDir %>',
        cssFiles: ['<%= modularProject.buildDocs.dest.cssDir %>*.css'],
        filesToRev: [
          '<%= modularProject.buildDocs.dest.dir %><%= modularProject.output.assetsSubDir %>font/*',
          '<%= modularProject.buildDocs.dest.dir %><%= modularProject.output.assetsSubDir %>images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= modularProject.buildDocs.dest.dir %><%= modularProject.output.cssSubDir %>*.css',
          '<%= modularProject.buildDocs.dest.dir %><%= modularProject.output.jsSubDir %>*.js',
          '<%= modularProject.buildDocs.dest.dir %><%= modularProject.output.vendorJSSubDir %>**/*.js'
        ],
        htmlFiles: [
          '<%= modularProject.buildDocs.dest.dir %>*.html',
          '<%= modularProject.buildDocs.dest.dir %><%= modularProject.output.viewsSubDir %>**/*.html'
        ],
        assetDir: '<%= modularProject.buildDocs.dest.dir %><%= modularProject.output.assetsSubDir %>',
        imagesDir: '<%= modularProject.buildDocs.dest.dir %><%= modularProject.output.assetsSubDir %>images/',
        jsDir: '<%= modularProject.buildDocs.dest.dir %><%= modularProject.output.jsSubDir %>',
      },

      vendorJSDir: '<%= modularProject.buildHTML.vendorJSDir %>',
      vendorJSFiles: '<%= modularProject.buildHTML.compilableVendorJSFiles %>',
      externalJSFiles: '<%= modularProject.buildHTML.nonCompilableVendorJSFiles %>',
      compiledCSSFiles: '<%= modularProject.buildHTML.compiledCSSFiles %>',

      copy: {
        files: [
          {expand: true, cwd: '<%= modularProject.build.dev.assetsDir %>', src: ['<%= modularProject.buildDocs.preOptimisedAssetFiles %>'], dest: '<%= modularProject.buildDocs.dest.assetDir %>'},
          {expand: true, flatten: true, src: '<%= modularProject.buildLibrary.libFile %>', dest: '<%= modularProject.buildDocs.dest.jsDir %>'},
          {expand: true, cwd: '<%= modularProject.build.dev.dir %>', src: '<%= modularProject.output.vendorJSSubDir %>**/*', dest: '<%= modularProject.buildDocs.dest.dir %>'},
          {expand: true, cwd: '<%= modularProject.buildDocs.src.dir %>', src: '<%= modularProject.buildDocs.src.htmlFiles %>', dest: '<%= modularProject.buildDocs.dest.dir %>'},
          {expand: true, cwd: '<%= modularProject.input.srcDir %>', src: '*.html', dest: '<%= modularProject.buildDocs.dest.dir %>'}
        ]
      },

      targethtml: {
        files: [{src: '<%= modularProject.buildDocs.dest.dir %>*.html', dest: '<%= modularProject.buildDocs.dest.dir %>'}]
      },

      htmlminFiles: [
        {expand: true, cwd: '<%= modularProject.buildDocs.dest.dir %>', src: '<%= modularProject.buildDocs.src.htmlFiles %>', dest: '<%= modularProject.buildDocs.dest.dir %>'},
        {expand: true, cwd: '<%= modularProject.buildDocs.dest.dir %>', src: '*.html', dest: '<%= modularProject.buildDocs.dest.dir %>'}
      ]
    },


    buildLibrary: {
      // Public config
      libDir: 'lib/',
      libFileNamePrefix: 'libFile',
      libSrcFiles: ['**/*.js'],

      // Private config
      libFile: '<%= modularProject.buildLibrary.libDir %><%= modularProject.buildLibrary.libFileNamePrefix %>.js',
      minLibFile: '<%= modularProject.buildLibrary.libDir %><%= modularProject.buildLibrary.libFileNamePrefix %>.min.js',

      // Task config
      clean: ['<%= modularProject.buildLibrary.libDir %>'],

      copy: {
        files: [{expand: true, cwd: '<%= modularProject.build.dev.jsDir %>', src: '<%= modularProject.buildLibrary.libSrcFiles %>', dest: '<%= modularProject.buildLibrary.libDir %>src'}]
      },

      concat: {
        files: [{
          src: ['<%= modularProject.buildLibrary.libDir %>src/**/*.js'],
          dest: '<%= modularProject.buildLibrary.libFile %>'
        }]
      },

      uglifyFiles: [{src: '<%= modularProject.buildLibrary.libFile %>', dest: '<%= modularProject.buildLibrary.minLibFile %>'}]
    },


    buildHTML: {
      // Public config
      compiledCSSFiles: [],
      compilableVendorJSFiles: [],
      nonCompilableVendorJSFiles: [],
      vendorJSDir: '<%= modularProject.output.vendorJSSubDir %>',

      // Private config
      html: {
        copy: {
          files: [
            {expand: true, flatten: false, cwd: '<%= modularProject.input.modulesDir %>', src: '<%= modularProject.input.htmlFiles %>', dest: '<%= modularProject.build.dev.viewsDir %>'},
            {expand: true, flatten: true,  cwd: '<%= modularProject.input.srcDir %>', src: '*.html', dest: '<%= modularProject.build.dev.dir %>'},
            {expand: true, flatten: false, cwd: '<%= modularProject.input.srcDir %>', src: '<%= modularProject.input.modulePartials %>/*', dest: '<%= modularProject.build.dev.viewsDir %>'}
          ]
        },
        watch: [
          '<%= modularProject.input.modulesDir %><%= modularProject.input.htmlFiles %>',
          '<%= modularProject.input.srcDir %>*.html',
          '<%= modularProject.input.srcDir %><%= modularProject.input.modulePartials %>/*'
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
              cwd: '<%= modularProject.input.modulesDir %>',
              src: '<%= modularProject.input.assetFiles %>',
              dest: '<%= modularProject.build.dev.assetsDir %>',
              rename: function (dest, src) {
                grunt.log.writeln('Copy: ' + src + ', ' + dest);
                // Remove the 'prefix/assets/ portion of the path
                var assetsDirName = '/' + grunt.config('modularProject.input.moduleAssets') + '/';
                var moduleName = src.substr(0, src.indexOf(assetsDirName));
                //grunt.log.ok('module name = ' + moduleName);
                var newPath = src.substr(src.indexOf(assetsDirName) + 8);
                return dest + '/' + moduleName + '/' + newPath;
              }
            }
          ]
        },
        watch: ['<%= modularProject.input.modulesDir %><%= modularProject.input.assetsFiles %>']
      }
    },


    buildSite: {
      // Public config
      preOptimisedAssetFiles: [
        '*/font/**/*',
        '*/language/**/*',
        '*/config/**/*'
      ],
      jsMinFile: 'app.js',

      // Private config
      src: {
        dir: '<%= modularProject.build.dev.dir %>',
        cssDir: '<%= modularProject.build.dev.cssDir %>',
        cssFiles: '*.css',
        htmlFiles: ['<%= modularProject.output.viewsSubDir %>/**/*.html'],
        imagesDir: '<%= modularProject.build.dev.assetsDir %>images/',
        jsFilesToConcat: [
          '<%= modularProject.build.dev.jsDir %>**/*.js'
        ]
      },

      dest: {
        dir: '<%= modularProject.build.prod.dir %>',
        cssDir: '<%= modularProject.buildSite.dest.dir %><%= modularProject.output.cssSubDir %>',
        cssFiles: ['<%= modularProject.buildSite.dest.cssDir %>*.css'],
        filesToRev: [
          '<%= modularProject.buildSite.dest.dir %><%= modularProject.output.assetsSubDir %>font/*',
          '<%= modularProject.buildSite.dest.dir %><%= modularProject.output.assetsSubDir %>images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= modularProject.buildSite.dest.dir %><%= modularProject.output.cssSubDir %>*.css',
          '<%= modularProject.buildSite.dest.dir %><%= modularProject.output.jsSubDir %>*.js',
          '<%= modularProject.buildSite.dest.dir %><%= modularProject.output.vendorJSSubDir %>**/*.js'
        ],
        htmlFiles: [
          '<%= modularProject.buildSite.dest.dir %>*.html',
          '<%= modularProject.buildSite.dest.dir %><%= modularProject.output.viewsSubDir %>**/*.html'],
        assetDir: '<%= modularProject.buildSite.dest.dir %><%= modularProject.output.assetsSubDir %>',
        imagesDir: '<%= modularProject.buildSite.dest.dir %><%= modularProject.output.assetsSubDir %>images/',
        jsDir: '<%= modularProject.buildSite.dest.dir %><%= modularProject.output.jsSubDir %>',
      },

      vendorJSFiles: '<%= modularProject.buildHTML.compilableVendorJSFiles %>',
      vendorJSDir: '<%= modularProject.buildHTML.vendorJSDir %>',
      externalJSFiles: '<%= modularProject.buildHTML.nonCompilableVendorJSFiles %>',
      compiledCSSFiles: '<%= modularProject.buildHTML.compiledCSSFiles %>',

      copy: {
        files: [
          {expand: true, cwd: '<%= modularProject.build.dev.assetsDir %>', src: ['<%= modularProject.buildSite.preOptimisedAssetFiles %>'], dest: '<%= modularProject.buildSite.dest.assetDir %>'},
          {expand: true, cwd: '<%= modularProject.build.dev.dir %>', src: '<%= modularProject.output.vendorJSSubDir %>**/*', dest: '<%= modularProject.buildSite.dest.dir %>'},
          {expand: true, cwd: '<%= modularProject.buildSite.src.dir %>', src: '<%= modularProject.buildSite.src.htmlFiles %>', dest: '<%= modularProject.buildSite.dest.dir %>'},
          {expand: true, cwd: '<%= modularProject.input.srcDir %>', src: '*.html', dest: '<%= modularProject.buildSite.dest.dir %>'}
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

    optimise: {
      tasks: ['mpBuildSite', 'beep:twobits']
    },

    release: {
      filesToBump: ['package.json', 'bower.json'],
      filesToCommit: ['package.json', 'bower.json', 'CHANGELOG.md'],
      tasks: []
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

    test: {
      tasks: {
        unitTest: ['mpUnitTest'],
        unitTestBrowser: ['karma:browser']
      }
    },

    unitTest: {
      // Public config
      tasks: ['mpVerify:all', 'karma:ci', 'coverage'],
      reportDir: '<%= modularProject.output.reportDir %>',
      baseConfig: '<%= modularProject.config.dir %>karma/karma.conf.js',
      browserConfig: '<%= modularProject.config.dir %>karma/karma.conf.js',
      CIConfig: '<%= modularProject.config.dir %>karma/karma.conf.js',
      testLibraryFiles: [],
      specs: '**/<%= modularProject.input.moduleUnitTest %>/*.spec.js',
      sourceFiles: ['<%= modularProject.input.modulesDir %>**/_*.js', '<%= modularProject.input.modulesDir %>**/*.js'], // The sequence is important

      // Private config
      modulesDir: '<%= modularProject.input.modulesDir %>',
      testFiles: [
        '<%= modularProject.unitTest.testLibraryFiles %>',

        // Our source code
        '<%= modularProject.unitTest.sourceFiles %>',

        // HTML Templates (which are converted to JS files by ng-html2js
        '<%= modularProject.input.modulesDir %>**/<%= modularProject.input.moduleTemplates %>/*.html',

        // Test specs
        '<%= modularProject.input.modulesDir %><%= modularProject.unitTest.specs %>'
      ],
      excludeFiles: [
        '<%= modularProject.input.modulesDir %>docs/**/*.js',   // No need to test the docs module
        '<%= modularProject.input.modulesDir %>**/docs/*.js'    // No need to test the docs examples
      ],
      preprocessors: {
        // Source files, that you want to generate coverage for.
        // Do not include tests or libraries
        // (these files will be instrumented by Istanbul)
//        'src/modules/**/!(*.spec).js': ['coverage'],    // This line must be generated because the src-path is dynamic, but we can't generate it using <%= %>
        '**/*.html': ['ng-html2js']
      }
    },

    verify: {
      // Public config
      reportDir: '<%= modularProject.output.reportDir %>',
      jshint: {
        baseConfig: '<%= modularProject.config.dir %>jshint/.jshintrc',
        testConfig: '<%= modularProject.config.dir %>jshint/.jshintrc',
        CIConfig: '<%= modularProject.config.dir %>jshint/.jshintrc'
      },
      jscs: {
        baseConfig: '<%= modularProject.config.dir %>jscs/.jscsrc',
        testConfig: '<%= modularProject.config.dir %>jscs/.jscsrc',
        CIConfig: '<%= modularProject.config.dir %>jscs/.jscsrc'
      },

      // Private config
      allFiles: {
        files: [
          {src: ['<%= modularProject.config.gruntFiles %>']},
          {expand: true, cwd: '<%= modularProject.input.modulesDir %>', src: ['<%= modularProject.input.jsFiles %>', '<%= modularProject.unitTest.specs %>']}
        ]
      },
      srcFiles: {
        files: [
          {src: ['<%= modularProject.config.gruntFiles %>']},
          {expand: true, cwd: '<%= modularProject.input.modulesDir %>', src: ['<%= modularProject.input.jsFiles %>', '!<%= modularProject.unitTest.specs %>']}
        ]
      },
      testFiles: {
        files: [
          {expand: true, cwd: '<%= modularProject.input.modulesDir %>', src: ['<%= modularProject.unitTest.specs %>']}
        ]
      }
    }
  };

  // Initialise the configuration
  (function init() {
    var path = require('path');

//    grunt.log.writeln('0 Tasks-build: ' + JSON.stringify(grunt.config('modularProject.build.tasks', null, '\t')));

    // Get the existing module config, replace it with the above, then merge the original back
    var origConfig = grunt.config.getRaw('modularProject');
    grunt.config.set('modularProject', cfg);
//    grunt.log.writeln('0.5 Tasks-build: ' + JSON.stringify(grunt.config('modularProject.build.tasks', null, '\t')));
    grunt.config.merge({ modularProject: origConfig });

//    grunt.log.writeln('1 GruntFiles: ' + grunt.config('modularProject.config.gruntFiles'));
//    grunt.log.writeln('1 Assets: ' + grunt.config('modularProject.input.moduleAssets'));
//    grunt.log.writeln('1 Tasks-build: ' + JSON.stringify(grunt.config('modularProject.buildDocs', null, '\t')));
    //grunt.log.writeln('1 Options: ' + JSON.stringify(options, null, '\t'));


    // Update the unitTest config with a dynamic key
    var preProcessorCoverageKey = '' + grunt.config('modularProject.input.modulesDir') + '**/!(*.spec).js';
    //grunt.log.writeln('Preprocessor key: ' + preProcessorCoverageKey);

    grunt.config.set('modularProject.unitTest.preprocessors.' + grunt.config.escape(preProcessorCoverageKey), ['coverage']);

    //grunt.log.writeln('Preprocessor: ' + JSON.stringify(grunt.config('modularProject.unitTest.preprocessors', null, '\t')));

    grunt.loadTasks(path.resolve(__dirname + '/subTasks'));
  })();



  grunt.registerTask('mpBuild', 'PRIVATE - do not use', function() {
    //grunt.log.writeln('mpBuild: ' + JSON.stringify(grunt.config('modularProject.buildJS'), null, '  '));
    grunt.log.writeln('mpBuild: ' + grunt.config('modularProject.build.tasks'));
    grunt.task.run(grunt.config('modularProject.build.tasks'));
  });

  grunt.registerTask('mpBuildUnoptimised', 'PRIVATE - do not use. Create an UN-optimised build', ['mpBuild']);

  grunt.registerTask('mpBuildOptimised', 'PRIVATE - do not use. Create an optimised build', function() {
    var tasks = ['mpBuild'].concat(grunt.config('modularProject.optimise.tasks'));
    grunt.log.writeln('mpBuildOptimised: ' + tasks);
    grunt.task.run(tasks);
  });

  grunt.registerTask('mpBuildWatch', 'PRIVATE - do not use. Create an UN-optimised build & watch it.', ['mpBuildUnoptimised', 'mpServe:dev', 'watch']);


  // TOTP-LEVEL TASKS
  // There are only 2 kinds of builds - development and production (optimized).
  // Unit tests run against development source code (unminified, but concatenated)

  grunt.registerTask('dev', 'Create a dev build then watch for changes', ['mpBuildWatch']);

  grunt.registerTask('build', 'Create a release build', function(target) {
    if (target === 'serve') {
      grunt.task.run(['mpBuildOptimised', 'mpServe:prod']);
    } else {
      grunt.task.run(['mpBuildOptimised']);
    }
  });

  // TEST
  grunt.registerTask('test', 'Run unit tests', function(target) {
    if (target === 'browser') {
      grunt.task.run(grunt.config('modularProject.test.tasks.unitTestBrowser'));
    } else {
      grunt.task.run(grunt.config('modularProject.test.tasks.unitTest'));
    }
  });


  // VERIFY
  grunt.registerTask('verify', 'Verify code syntax, style and formatting', function(target) {
    grunt.task.run('mpVerify' + ((target) ? ':' + target : ''));
  });

  grunt.registerTask('default', ['dev']);

};
