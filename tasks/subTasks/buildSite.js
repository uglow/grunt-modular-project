module.exports = function(grunt) {
  'use strict';

  var util = require('../lib/utils.js');
  var config = grunt.config('modularProject.buildSite');

  grunt.task.loadNpmTasks('grunt-usemin');
  grunt.task.renameTask('usemin', 'useminSite');  // Rename this task so that it isn't over-ridden by other usemin instances

//  grunt.log.ok('BuildSiteConfig: ' + JSON.stringify(grunt.config('modularProject.build'), null, '  '));

  // This config must exist before the multi-task is registered :(
  grunt.extendConfig({
    mpBuildSite: {
      pre: ['clean:site'],
      images: ['concurrent:siteImages'],
      copyAlreadyOptimisedAndHTMLInPreparationForOptimisation: ['copy:site'],
      optimiseJS: ['concat:optimize'],
      useOptimisedHTMLFragments: ['targethtml:site'],
      fileRevAssets: ['filerev:site', 'useminSite'],
      postHTMLProcessing: ['htmlmin:site']
    },

    clean: {
      site: config.dest.dir
    },

    concurrent: {
      siteImages: ['imagemin:site', 'svgmin:site', 'cssmin:site']
    },

    concat: {
      optimize: {
        files: [
          {src: config.src.jsFilesToConcat, dest: config.dest.jsDir + config.dest.jsMinFile}
        ]
      }
    },

    copy: {
      site: config.copy
    },

    cssmin: {
      options: {
        report: 'min'
      },
      site: {
        files: [{expand: true, cwd: config.src.cssDir, src: config.src.cssFiles, dest: config.dest.cssDir}]
      }
    },

    imagemin: {
      site: {
        files: [{expand: true, cwd: config.src.imagesDir, src: '{,*/}*.{png,jpg,jpeg,gif}', dest: config.dest.imagesDir}]
      }
    },

    svgmin: {
      site: {
        files: [{expand: true, cwd: config.src.imagesDir, src: '{,*/}*.svg', dest: config.dest.imagesDir}]
      }
    },

    filerev: {
      site: {
        src: config.dest.filesToRev
      }
    },

    targethtml: {
      site: config.targethtml
    },

    htmlmin: {
      site: {
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

    useminSite: {
      html: config.dest.htmlFiles,
      css: config.dest.cssFiles,
      options: {
        assetsDirs: [config.dest.dir, config.dest.assetDir]
      }
    }
  });

  grunt.config.set('targethtml.site.options.curlyTags.vendorScripts', util.generateHTMLScriptTags(config.vendorJSFiles, config.vendorJSDir));
  grunt.config.set('targethtml.site.options.curlyTags.externalScripts', util.generateHTMLScriptTags(config.externalJSFiles, config.vendorJSDir));
  grunt.config.set('targethtml.site.options.curlyTags.cssFiles', util.generateHTMLLinkTags(config.compiledCSSFiles));

  grunt.registerMultiTask('mpBuildSite', 'Optimise the website for production', function () {
    grunt.log.writeln(this.target + ': ' + this.data);

    // Execute each task
    grunt.task.run(this.data);
  });
};
