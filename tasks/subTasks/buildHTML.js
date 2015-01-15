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
        tasks: ['copy:html', 'mpBuildHTMLUnoptimisedTags', 'targethtml:unoptimised']
      },
      moduleAssets: {
        files: config.moduleAssets.watch,
        tasks: ['copy:moduleAssets']
      }
    }
  });


  grunt.registerTask('mpSetHTMLTag', function (configPropertyName, tagNamePrefix, tagName, fileType, outputDirPrefix) {
    var fileSpec = grunt.config(configPropertyName), files = [],
        outputDirPath = (outputDirPrefix) ? grunt.config(outputDirPrefix) : '';

//    grunt.log.ok('tagType = ' + tagNamePrefix);
//    grunt.log.ok('tagName = ' + tagName);
//    grunt.log.ok('fileType = ' + fileType); // Can be 'script' or 'link'
//    grunt.log.ok('outputPrefix = ' + outputDirPrefix);
//    grunt.log.ok('fileSpec = ' + JSON.stringify(fileSpec));

    if (fileSpec.cwd) {
      files = grunt.file.expand({cwd: fileSpec.cwd}, fileSpec.src);
    } else {
      files = grunt.file.expand(fileSpec.src || fileSpec);
    }
    grunt.log.ok('{{' + tagName + '}}:\n' + files.join('\n'));

    grunt.config.set('targethtml.' + tagNamePrefix + '.options.curlyTags.' + tagName, util.generateHTMLTags(fileType, files, outputDirPath));
  });


  // This tasks creates the {{ }} tags for the 'targethtml' task to replace
  grunt.registerTask('mpBuildHTMLUnoptimisedTags', [
    'mpSetHTMLTag:modularProject.buildHTML.compilableVendorJSFiles:unoptimised:vendorScripts:script:modularProject.output.vendorJSSubDir',
    'mpSetHTMLTag:modularProject.buildHTML.nonCompilableVendorJSFiles:unoptimised:externalScripts:script:modularProject.output.vendorJSSubDir',
    'mpSetHTMLTag:modularProject.buildHTML.compiledCSSFileSpec:unoptimised:cssFiles:link',
    'mpSetHTMLTag:modularProject.buildJS.compiledAppJSFiles:unoptimised:appScripts:script'
  ]);


  grunt.registerTask('mpBuildHTML', ['copy:html', 'copy:moduleAssets', 'mpBuildHTMLUnoptimisedTags', 'targethtml:unoptimised']);

};
