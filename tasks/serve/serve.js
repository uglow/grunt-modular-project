module.exports = function(grunt) {
  'use strict';

  var config = grunt.config.get('modularProject.serve');
  var compression = require('compression');

  grunt.extendConfig({
    mpServe: {
      dev: ['connect:dev'],
      prod: ['connect:prod']
    },
    // The actual grunt server settings
    connect: {
      dev: {
        options: {
          open: false,
          base: config.dev.baseDir,
          port: config.dev.port,
          hostname: config.dev.hostname,
          livereload: 35729,
          middleware: function(connect, options, middlewares) {
            if (config.dev.useCompression) {
              // inject a custom middleware into the array of default middlewares
              middlewares.unshift(compression());
            }
            return middlewares;
          }
        }
      },
      prod: {
        options: {
          open: false,
          base: config.prod.baseDir,
          port: config.prod.port,
          hostname: config.prod.hostname,
          keepalive: true,
          middleware: function(connect, options, middlewares) {
            if (config.prod.useCompression) {
              // inject a custom middleware into the array of default middlewares
              middlewares.unshift(compression());
            }
            return middlewares;
          }
        }
      }
    }
  });

  grunt.registerMultiTask('mpServe', 'Start a webserver and serve files', function () {
    grunt.log.writeln(this.target + ': ' + this.data);

    // Execute each task
    grunt.task.run(this.data);
  });
};
