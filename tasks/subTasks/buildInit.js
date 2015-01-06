module.exports = function(grunt) {
  'use strict';

  var config = grunt.config.get('modularProject');

  grunt.extendConfig({
    clean: {
      mpDev: config.build.dev.dir
    },

    watch: {
      // Watch the Grunt config files - if they change, rebuild
      gruntConfig: {
        files: config.config.gruntFiles,
        tasks: ['mpBuild']
      },
      // Watch the output files
      dev: {
        files: config.build.dev.livereloadFiles,
        options: {
          livereload: true
        }
      }
    }
  });

  grunt.registerTask('mpBuildInit', 'Cleans the modular project folders', function () {
    grunt.task.run('clean:mpDev');
  });
}
