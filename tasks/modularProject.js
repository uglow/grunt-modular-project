/*
 * grunt-modular-project
 * https://github.com/uglow/grunt-modular-project/
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
      moduleE2ETest: 'e2eTest',

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
        commitTemplate: '',
        commitHooksDir: '',
        hookName: ''
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
      tasks: ['stylus', 'autoprefixer'],
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
      compiledAppJSFiles: {cwd: '<%= modularProject.build.dev.dir %>', src: ['<%= modularProject.output.jsSubDir %>**/*.js']},

      // Tasks
      clean: ['<%= modularProject.buildJS.tempTemplateDir %>', '<%= modularProject.buildJS.tempJSDir %>'],
          // Don't clean files from the build.dev folder, as the server is probably running and will have a file-lock (on windows)
          //, '<%= modularProject.build.dev.vendorJSDir %>', '<%= modularProject.build.dev.jsDir %>'],

      copy: {
        htmlTemplatesToTemp: {
          files: [
            {expand: true, flatten: false, cwd: '<%= modularProject.input.modulesDir %>', src: '<%= modularProject.input.templateHTMLFiles %>', dest: '<%= modularProject.buildJS.tempTemplateDir %>'}
          ]
        },
        jsToTemp: {
          files: [
            {expand: true, flatten: false, cwd: '<%= modularProject.input.modulesDir %>', src: ['<%= modularProject.input.jsFiles %>', '!<%= modularProject.unitTest.specs %>', '!<%= modularProject.e2eTest.specs %>'], dest: '<%= modularProject.buildJS.tempJSDir %>'}
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
              src: ['<%= modularProject.input.jsFiles %>', '!<%= modularProject.unitTest.specs %>', '!<%= modularProject.e2eTest.specs %>'], // Concat files starting with '_' first, ignore test specs
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
            '<%= modularProject.input.modulesDir %><%= modularProject.unitTest.specs %>'
          ],
          // This watch task needs to be flattened manually as Grunt doesn't do a good job of it.
          tasks: ['mpBuildJS', 'verify:allNewer', 'test:unit']
        },
        e2e: {
          files: [
            '<%= modularProject.input.modulesDir %><%= modularProject.e2eTest.specs %>'
          ],
          tasks: ['verify:test']
        },
        jsHtmlTemplates: {
          files: ['<%= modularProject.input.modulesDir %><%= modularProject.input.templateHTMLFiles %>']
        },
        vendorJS: {
          files: ['<%= modularProject.buildJS.vendorJSFiles %>']
        }
      }
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

      // Private config
      compiledCSSFileSpec: {cwd: '<%= modularProject.build.dev.dir %>', src: ['<%= modularProject.buildHTML.compiledCSSFiles %>']},
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


    optimise: {
      // Public config
      tasks: [
        'clean:optimised',
        'concurrent:optimisedImages',
        'copy:optimised',
        'concat:optimised', 'uglify:optimised',
        'mpOptimiseHTMLTags', 'targethtml:optimised',
        'filerev:optimised', 'useminOptimised',
        'htmlmin:optimised', 'usebanner'
      ],

      preOptimisedAssetFiles: [
        '*/font/**/*',
        '*/language/**/*',
        '*/config/**/*'
      ],
      jsMinFile: 'app.js',
      jsMinFileSpec: {cwd: '<%= modularProject.optimise.dest.dir %>', src: '<%= modularProject.output.jsSubDir %><%= modularProject.optimise.jsMinFile %>'},
      jsFilesToConcat: [
        // Note that we *could* concat the vendor JS files here too, and the library file.
        // But instead we use a this as the default and allow customisation/overriding with more aggressive optimisation
        '<%= modularProject.build.dev.jsDir %>**/*.js'
      ],
      filesToCopy: [],
      banner: '',     // A banner to apply to the distributed source code
      bannerFiles: [], // A files to apply the banner to

      // Private config
      src: {
        dir: '<%= modularProject.build.dev.dir %>',
        cssDir: '<%= modularProject.build.dev.cssDir %>',
        cssFiles: '*.css',
        htmlFiles: ['<%= modularProject.output.viewsSubDir %>/**/*.html'],
        imagesDir: '<%= modularProject.build.dev.assetsDir %>',
        imageFiles: '**/images/*.{png,jpg,jpeg,gif}',
        svgFiles: '**/images/*.svg'
      },

      dest: {
        dir: '<%= modularProject.build.prod.dir %>',
        cssDir: '<%= modularProject.optimise.dest.dir %><%= modularProject.output.cssSubDir %>',
        cssFiles: ['<%= modularProject.optimise.dest.cssDir %>*.css'],
        filesToRev: [
          '<%= modularProject.optimise.dest.dir %><%= modularProject.output.assetsSubDir %>font/*',
          '<%= modularProject.optimise.dest.dir %><%= modularProject.output.assetsSubDir %>**/*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= modularProject.optimise.dest.dir %><%= modularProject.output.cssSubDir %>*.css',
          '<%= modularProject.optimise.dest.dir %><%= modularProject.output.jsSubDir %>*.js',
          '<%= modularProject.optimise.dest.dir %><%= modularProject.output.vendorJSSubDir %>**/*.js'
        ],
        htmlFiles: [
          '<%= modularProject.optimise.dest.dir %>*.html',
          '<%= modularProject.optimise.dest.dir %><%= modularProject.output.viewsSubDir %>**/*.html'
        ],
        assetDir: '<%= modularProject.optimise.dest.dir %><%= modularProject.output.assetsSubDir %>',
        imagesDir: '<%= modularProject.optimise.dest.dir %><%= modularProject.output.assetsSubDir %>',
        jsDir: '<%= modularProject.optimise.dest.dir %><%= modularProject.output.jsSubDir %>'
      },

      vendorJSFiles: '<%= modularProject.buildHTML.compilableVendorJSFiles %>',

      copy: {
        files: [
          '<%= modularProject.optimise.filesToCopy %>',
          {expand: true, cwd: '<%= modularProject.build.dev.assetsDir %>', src: ['<%= modularProject.optimise.preOptimisedAssetFiles %>'], dest: '<%= modularProject.optimise.dest.assetDir %>'},
          {expand: true, cwd: '<%= modularProject.build.dev.dir %>', src: '<%= modularProject.output.vendorJSSubDir %>**/*', dest: '<%= modularProject.optimise.dest.dir %>'},
          {expand: true, cwd: '<%= modularProject.optimise.src.dir %>', src: '<%= modularProject.optimise.src.htmlFiles %>', dest: '<%= modularProject.optimise.dest.dir %>'},
          {expand: true, cwd: '<%= modularProject.input.srcDir %>', src: '*.html', dest: '<%= modularProject.optimise.dest.dir %>'}
        ]
      },

      targethtml: {
        files: [{src: '<%= modularProject.optimise.dest.dir %>*.html', dest: '<%= modularProject.optimise.dest.dir %>'}]
      },

      htmlmin: {
        options: {
          collapseWhitespace: true,
          conservativeCollapse: true,
          collapseBooleanAttributes: false,   // Setting this to true will reduce the required="true" attribute to required, which breaks the app.
          removeAttributeQuotes: true,
          removeComments: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [
          {expand: true, cwd: '<%= modularProject.optimise.dest.dir %>', src: '<%= modularProject.optimise.src.htmlFiles %>', dest: '<%= modularProject.optimise.dest.dir %>'},
          {expand: true, cwd: '<%= modularProject.optimise.dest.dir %>', src: '*.html', dest: '<%= modularProject.optimise.dest.dir %>'}
        ]
      }
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
        hostname: 'localhost',
        useCompression: false
      },
      prod: {
        baseDir: ['<%= modularProject.build.prod.dir %>'],
        port: 8000,
        hostname: 'localhost',
        useCompression: true
      }
    },

    test: {
      tasks: {
        unitTest: ['karma:ci', 'coverage'],
        unitTestBrowser: ['karma:browser'],
        e2e: []   // Could be anything you like, such as Protractor
      }
    },

    e2eTest: {
      // Define the e2eTest spec files, and this WON'T be included when building the JS apps
      // This path MUST be relative to <%= modularProject.input.modulesDir %>
      specs: '**/<%= modularProject.input.moduleE2ETest %>/*.js'
    },


    unitTest: {
      // Public config
      reportDir: '<%= modularProject.output.reportDir %>',
      baseConfig: '<%= modularProject.config.dir %>karma/karma.conf.js',
      browserConfig: '<%= modularProject.config.dir %>karma/karma.conf.js',
      CIConfig: '<%= modularProject.config.dir %>karma/karma.conf.js',
      testLibraryFiles: [],
      specs: '**/<%= modularProject.input.moduleUnitTest %>/*.spec.js',   // This path MUST be relative to <%= modularProject.input.modulesDir %>
      sourceFiles: ['<%= modularProject.input.modulesDir %>**/_*.js', '<%= modularProject.input.modulesDir %>**/*.js'], // The sequence is important

      coverage: {
        options: {
          thresholds: {
            statements: 90,
            branches: 90,
            lines: 90,
            functions: 90
          },
          dir: 'coverage',
          root: '<%= modularProject.unitTest.reportDir %>'
        }
      },

      karma: {
        options: {
          exclude: '<%= modularProject.unitTest.excludeFiles %>',
          preprocessors: '<%= modularProject.unitTest.preprocessors %>',
          coverageReporter: {
            reporters: [
              { type: 'html' },
              { type: 'lcov' },
              { type: 'text' },         // Needed for grunt-istanbul-coverage task
              { type: 'json' }          // Needed for grunt-istanbul-coverage task
            ],
            dir: '<%= modularProject.unitTest.reportDir %>coverage'
          },
          ngHtml2JsPreprocessor: {
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
              var modulesDir = grunt.config('modularProject.input.modulesDir');
              return filepath.substr(modulesDir.length);
            }
          }
        }
      },


      // Private config
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
      tasks: {
        allJS: ['jshint:all', 'jscs:all'],
        srcJS: ['jshint:src', 'jscs:src'],
        testJS: ['jshint:test', 'jscs:test'],
        allJSForCI: ['jshint:ci', 'jscs:ci'],
        allNewerJS: ['newer:jshint:all', 'newer:jscs:all']
      },
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
          {expand: true, cwd: '<%= modularProject.input.modulesDir %>', src: ['<%= modularProject.input.jsFiles %>', '<%= modularProject.unitTest.specs %>', '<%= modularProject.e2eTest.specs %>']}
        ]
      },
      srcFiles: {
        files: [
          {src: ['<%= modularProject.config.gruntFiles %>']},
          {expand: true, cwd: '<%= modularProject.input.modulesDir %>', src: ['<%= modularProject.input.jsFiles %>', '!<%= modularProject.unitTest.specs %>', '!<%= modularProject.e2eTest.specs %>']}
        ]
      },
      testFiles: {
        files: [
          {expand: true, cwd: '<%= modularProject.input.modulesDir %>', src: ['<%= modularProject.unitTest.specs %>', '<%= modularProject.e2eTest.specs %>']}
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
    var tasks = ['mpBuild', 'test:unit'].concat(grunt.config('modularProject.optimise.tasks'));
    grunt.log.writeln('mpBuildOptimised: ' + tasks);
    grunt.task.run(tasks);
  });

  grunt.registerTask('mpBuildWatch', 'PRIVATE - do not use. Create an UN-optimised build & watch it.', ['mpBuildUnoptimised', 'mpServe:dev', 'watch']);


  // TOP-LEVEL TASKS
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
    } else if (target === 'e2e') {
      grunt.task.run(grunt.config('modularProject.test.tasks.e2e'));
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
