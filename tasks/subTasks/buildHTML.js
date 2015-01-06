module.exports = function(grunt) {
  'use strict';

  var config = grunt.config.get('modularProject.buildHTML');

  function linkTemplateFn(fileName) {
    return '<link rel="stylesheet" href="' + fileName + '">\n';
  }

  function scriptTemplateFn(fileName) {
    var vendorPath = config.vendorDir;
    return '<script src="' + vendorPath + fileName + '"></script>\n';
  }

  function generateTags(files, templateFn) {
    var result = '';
    files.forEach(function (fileName) {
      result += templateFn(fileName);
    });
    return result;
  }

  grunt.extendConfig({
    copy: {
      html: config.html.copy,
      moduleAssets: config.moduleAssets.copy
    },

    targethtml: {
      unoptimised: config.html.filesWithTemplateTags
      // There's some extra config here to generate the vendor scripts
    },

    watch: {
      html: {
        files: config.html.watch,
        tasks: ['copy:html', 'targethtml:unoptimised']
      },
      moduleAssets: {
        files: config.moduleAssets.watch,
        tasks: ['copy:moduleAssets']
      }
    }
  });

  // This task takes a list of vendorJS files and turns it into a string containing <script> tags, stored in a config variable
  grunt.config.set('targethtml.unoptimised.options.curlyTags.vendorScripts', generateTags(config.vendorJSFiles, scriptTemplateFn));
  grunt.config.set('targethtml.unoptimised.options.curlyTags.externalScripts', generateTags(config.externalJSFiles, scriptTemplateFn));
  grunt.config.set('targethtml.optimised.options.curlyTags.vendorScripts', generateTags(config.vendorJSFiles, scriptTemplateFn));
  grunt.config.set('targethtml.optimised.options.curlyTags.externalScripts', generateTags(config.externalJSFiles, scriptTemplateFn));

  // This task takes a list of vendorJS files and turns it into a string containing <link> tags, stored in a config variable
  grunt.config.set('targethtml.unoptimised.options.curlyTags.cssFiles', generateTags(config.compiledCSSFiles, linkTemplateFn));
  grunt.config.set('targethtml.optimised.options.curlyTags.cssFiles', generateTags(config.compiledCSSFiles, linkTemplateFn));


//  grunt.registerTask('mpConfigTrace', function() {
//    grunt.log.writeln('CONFIG:' + JSON.stringify(grunt.config('copy.html'), null, '\t'));
//  });

  grunt.registerTask('mpBuildHTML', 'PRIVATE - do not use', function() {
    grunt.task.run(['copy:html', 'copy:moduleAssets', 'targethtml:unoptimised']);
  });
};
