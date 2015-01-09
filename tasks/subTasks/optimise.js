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
      optimiseJS: ['concat:optimised'],
      useOptimisedHTMLFragments: ['targethtml:optimised'],
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

    useminOptimised: {
      html: config.dest.htmlFiles,
      css: config.dest.cssFiles,
      options: {
        assetsDirs: [config.dest.dir, config.dest.assetDir]
      }
    }
  });

  grunt.config.set('targethtml.optimised.options.curlyTags.vendorScripts', util.generateHTMLScriptTags(config.vendorJSFiles, config.vendorJSDir));
  grunt.config.set('targethtml.optimised.options.curlyTags.externalScripts', util.generateHTMLScriptTags(config.externalJSFiles, config.vendorJSDir));
  grunt.config.set('targethtml.optimised.options.curlyTags.cssFiles', util.generateHTMLLinkTags(config.compiledCSSFiles));

  grunt.registerMultiTask('mpOptimise', 'Optimise the website for production', function () {
    grunt.log.writeln(this.target + ': ' + this.data);

    // Execute each task
    grunt.task.run(this.data);
  });
};
