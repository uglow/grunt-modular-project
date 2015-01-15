module.exports = function(grunt) {
  'use strict';

  var path = require('path');
  var util = require(path.resolve(__dirname + '/../lib/utils.js'));
  var config = grunt.config('modularProject.optimise');

  grunt.task.loadNpmTasks('grunt-usemin');
  grunt.task.renameTask('usemin', 'useminOptimised');  // Rename this task so that it isn't over-ridden by other usemin instances

  // This config must exist before the multi-task is registered :(
  grunt.extendConfig({
    mpOptimise: {
      pre: ['clean:optimised'],
      images: ['concurrent:optimisedImages'],
      copyAlreadyOptimisedAndHTMLInPreparationForOptimisation: ['copy:optimised'],
      optimiseJS: ['concat:optimised', 'uglify:optimised'],
      useOptimisedHTMLFragments: ['mpOptimiseHTMLTags', 'targethtml:optimised'],
      fileRevAssets: ['filerev:optimised', 'useminOptimised'],
      postHTMLProcessing: ['htmlmin:optimised']
    },

    clean: {
      optimised: config.dest.dir
    },

    concurrent: {
      optimisedImages: ['imagemin:optimised', 'svgmin:optimised', 'cssmin:optimised']
    },

    concat: {
      optimised: {
        files: [
          {src: config.jsFilesToConcat, dest: config.dest.jsDir + config.jsMinFile}
        ]
      }
    },

    copy: {
      optimised: config.copy
    },

    cssmin: {
      options: {
        report: 'min'
      },
      optimised: {
        files: [{expand: true, cwd: config.src.cssDir, src: config.src.cssFiles, dest: config.dest.cssDir}]
      }
    },

    imagemin: {
      optimised: {
        files: [{expand: true, cwd: config.src.imagesDir, src: '{,*/}*.{png,jpg,jpeg,gif}', dest: config.dest.imagesDir}]
      }
    },

    svgmin: {
      optimised: {
        files: [{expand: true, cwd: config.src.imagesDir, src: '{,*/}*.svg', dest: config.dest.imagesDir}]
      }
    },

    filerev: {
      optimised: {
        src: config.dest.filesToRev
      }
    },

    targethtml: {
      optimised: config.targethtml
    },

    htmlmin: {
      optimised: config.htmlmin
    },


    uglify: {
      optimised: {
        options: {
          report: 'min',
          compress: {
            /* Conditional compilation vars are conditionally removed by this step.
             * Leave prod.json > CONDITIONAL_COMPILATION as '' and set variables here (to remove left-over code)*/
            'global_defs': {
              //"DEBUG": '<%= env.environment.debugMode %>'
            },
            'dead_code': true
          },
          mangle: true
        },
        files: [
          {src: config.dest.jsDir + config.jsMinFile, dest: config.dest.jsDir + config.jsMinFile}
        ]
      }
    },

    useminOptimised: {
      html: config.dest.htmlFiles,
      css: config.dest.cssFiles,
      options: {
        assetsDirs: [config.dest.dir, config.dest.assetDir]
      }
    }
  });


  grunt.registerTask('mpOptimiseHTMLTags', [
    'mpSetHTMLTag:modularProject.buildHTML.compilableVendorJSFiles:optimised:vendorScripts:script:modularProject.output.vendorJSSubDir',
    'mpSetHTMLTag:modularProject.buildHTML.nonCompilableVendorJSFiles:optimised:externalScripts:script:modularProject.output.vendorJSSubDir',
    'mpSetHTMLTag:modularProject.buildHTML.compiledCSSFileSpec:optimised:cssFiles:link',
    'mpSetHTMLTag:modularProject.optimise.jsMinFileSpec:optimised:appScripts:script'
  ]);


  grunt.registerMultiTask('mpOptimise', 'Optimise the website for production', function () {
    grunt.log.writeln(this.target + ': ' + this.data);

    // Execute each task
    grunt.task.run(this.data);
  });
};
