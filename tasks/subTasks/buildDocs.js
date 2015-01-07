module.exports = function(grunt) {
  'use strict';

  var util = require('../lib/utils.js');
  var config = grunt.config('modularProject.buildDocs');

//  grunt.log.ok('BUILD_DOCS: ' + config);

  grunt.task.loadNpmTasks('grunt-usemin');
  grunt.task.renameTask('usemin', 'useminDocs');  // Rename this task so that it isn't over-ridden by other usemin instances

  // This config must exist before the multi-task is registered :(
  grunt.extendConfig({
    mpBuildDocs: {
      pre: ['clean:docs'],
      images: ['concurrent:docsImages'],
      copyAlreadyOptimisedAndHTMLInPreparationForOptimisation: ['copy:docs'],
      optimiseJS: ['concat:docsOptimize'],
      useOptimisedHTMLFragments: ['targethtml:docs'],
      fileRevAssets: ['filerev:docs', 'useminDocs']
      // Don't minify the HTML, as it affects the formatting (can't get <!-- htmlmin:ignore --> to work)
    },

    clean: {
      docs: config.dest.dir
    },

    concurrent: {
      docsImages: ['imagemin:docs', 'svgmin:docs', 'cssmin:docs']
    },

    concat: {
      docsOptimize: {
        files: [
          {src: config.src.jsFilesToConcat, dest: config.dest.jsDir + config.dest.jsMinFile}
        ]
      }
    },

    copy: {
      docs: config.copy,
    },

    cssmin: {
      options: {
        report: 'min'
      },
      docs: {
        files: [
          {expand: true, cwd: config.src.cssDir, src: config.src.cssFiles, dest: config.dest.cssDir}
        ]
      }
    },

    imagemin: {
      docs: {
        files: [
          {expand: true, cwd: config.src.imagesDir, src: '{,*/}*.{png,jpg,jpeg,gif}', dest: config.dest.imagesDir}
        ]
      }
    },

    svgmin: {
      docs: {
        files: [
          {expand: true, cwd: config.src.imagesDir, src: '{,*/}*.svg', dest: config.dest.imagesDir}
        ]
      }
    },

    filerev: {
      docs: {
        src: config.dest.filesToRev
      }
    },

    targethtml: {
      docs: config.targethtml
    },

    htmlmin: {
      docs: {
        options: {
          collapseWhitespace: true,
          conservativeCollapse: true,
          collapseBooleanAttributes: false,   // Setting this to true will reduce the required="true" attribute to required, which breaks the app.
          removeAttributeQuotes: true,
          removeComments: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: config.htmlminFiles
      }
    },

    useminDocs: {
      html: config.dest.htmlFiles,
      css: config.dest.cssFiles,
      options: {
        assetsDirs: [config.dest.dir, config.dest.assetDir]
      }
    }
  });


  grunt.config.set('targethtml.docs.options.curlyTags.vendorScripts', util.generateHTMLScriptTags(config.vendorJSFiles, config.vendorDir));
  grunt.config.set('targethtml.docs.options.curlyTags.externalScripts', util.generateHTMLScriptTags(config.externalJSFiles, config.vendorDir));
  grunt.config.set('targethtml.docs.options.curlyTags.cssFiles', util.generateHTMLLinkTags(config.compiledCSSFiles));


  grunt.registerMultiTask('mpBuildDocs', 'Optimise the documentation for production', function () {
    grunt.log.writeln(this.target + ': ' + this.data);

    // Execute each task
    grunt.task.run(this.data);
  });
};
