"use strict";

// Global function for helping to interact with HTML
function linkTemplateFn(fileName, prefixPath) {
  return '<link rel="stylesheet" href="' + prefixPath + fileName + '">\n';
}

function scriptTemplateFn(fileName, prefixPath) {
  return '<script src="' + prefixPath + fileName + '"></script>\n';
}

function generateTags(files, templateFn, prefixPath) {
  var result = '';
  (files || []).forEach(function (fileName) {
    result += templateFn(fileName, prefixPath || '');
  });
  return result;
}

module.exports = {
  generateHTMLScriptTags: function (files, prefixPath) {
    return generateTags(files, scriptTemplateFn, prefixPath);
  },
  generateHTMLLinkTags: function (files, prefixPath) {
    return generateTags(files, linkTemplateFn, prefixPath);
  }
};
