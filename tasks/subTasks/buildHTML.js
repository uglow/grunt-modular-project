module.exports = function(grunt) {
  'use strict';

  var path = require('path');
  var util = require(path.resolve(__dirname + '/../lib/utils.js'));
  var config = grunt.config.get('modularProject.buildHTML');

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
  grunt.config.set('targethtml.unoptimised.options.curlyTags.vendorScripts', util.generateHTMLScriptTags(config.compilableVendorJSFiles, config.vendorJSDir));
  grunt.config.set('targethtml.unoptimised.options.curlyTags.externalScripts', util.generateHTMLScriptTags(config.nonCompilableVendorJSFiles, config.vendorJSDir));

  // This task takes a list of vendorJS files and turns it into a string containing <link> tags, stored in a config variable
  grunt.config.set('targethtml.unoptimised.options.curlyTags.cssFiles', util.generateHTMLLinkTags(config.compiledCSSFiles));


  grunt.registerTask('mpBuildHTML', 'PRIVATE - do not use', function() {
    grunt.task.run(['copy:html', 'copy:moduleAssets', 'targethtml:unoptimised']);
  });
};
