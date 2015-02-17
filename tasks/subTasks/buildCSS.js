module.exports = function(grunt) {
  'use strict';

  var config = grunt.config('modularProject.buildCSS');

//  grunt.log.ok('BUILD_CSS: ' + config);

  grunt.extendConfig({
    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['> 2%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1']
      },
      prefix: config.autoPrefix
    },
    copy: {
      externalCSS: config.copy
    },
    // Default CSS compiler implementation - Stylus
    stylus: {
      compile: {
        options: {
          compress: false
        },
        paths: config.compile.sourceDirs,
        files: config.compile.files
      }
    },
    watch: {
      compileCss: {
        files: config.watch.files,
        tasks: config.tasks
      }
    }
  });

  grunt.registerTask('mpBuildCSS', function() {
    //grunt.log.writeln('BuildCSS config ' + JSON.stringify(grunt.config('modularProject.buildCSS.compile'), null, '\t'));
    //grunt.log.writeln('Stylus config ' + JSON.stringify(grunt.config('stylus'), null, '\t'));

    grunt.task.run(config.tasks);
    grunt.task.run(['copy:externalCSS']);
  });
};
