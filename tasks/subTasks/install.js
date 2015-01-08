module.exports = function(grunt) {
  'use strict';

  var config = grunt.config('modularProject.install');

  grunt.extendConfig({
    exec: {
      gittemplate: {
        stdout: true
      }
    }
  });


  var mkdirp = require('mkdirp');
  var path = require('path');
  var fs = require('fs');

  function symLink(src, dest, type) {
    try {
      fs.symlinkSync(src, dest, type || 'file');
    } catch(e) {
      if (e.code === 'EEXIST'){
        return grunt.log.error(dest + ' already exists, skipping');
      }
      else if (e.code === 'EPERM' && /^win/.test(process.platform)){
        return grunt.fail.warn('For symlinks to work on Windows you have ' +
          'to run the cmd as administrator, ' +
          'or setup read permissions correctly.');
      }
      grunt.fail.warn(e);
    }
  }


  function installCommitHook() {
    mkdirp('.git/hooks');

    var fileName = config.git.commitHookFileRelativePath || path.relative('.git/hooks', __dirname + '../../../config/git/validate-commit-msg.js');
    grunt.log.debug('Relative commit hook path: ' + fileName);

    try {
      fs.unlinkSync('.git/hooks/commit-msg');
    } catch (e) {
      // Ignore, it just means the symlink does not exist
    }
    symLink(fileName, '.git/hooks/commit-msg', 'file')
  }


  function installCommitTemplate() {
    var pathToCommitMsgTemplate = config.git.commitTemplate || path.relative('./', __dirname + '../../../../config/git/git-commit-template.txt');
    grunt.log.debug('Commit message template path: ' + pathToCommitMsgTemplate);
    grunt.config.set('exec.gittemplate.command', 'git config commit.template ' + pathToCommitMsgTemplate);
    grunt.task.run(['exec:gittemplate']);

  }


  function putNodeOnPathForSourceTree() {
    // Link node to the /usr/bin folder, so that Sourcetree can see error messages when the commit-hook rejects a commit
    var src = config.node.localNodeJSEXEPath || '/usr/local/bin/node';
    var dest = config.node.globalNodeJSXEPath || '/usr/bin/node';
    symLink(src, dest, 'file');
  }


  grunt.registerTask('install', 'Post-installation tasks for the project', function() {
    installCommitHook();
    installCommitTemplate();
    putNodeOnPathForSourceTree();
  });
};
