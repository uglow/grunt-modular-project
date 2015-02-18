# [grunt-modular-project](https://github.com/uglow/grunt-modular-project)
[![npm version](https://badge.fury.io/js/grunt-modular-project.svg)](http://badge.fury.io/js/grunt-modular-project)
[![devDependency Status](https://david-dm.org/uglow/grunt-modular-project/dev-status.svg)](https://david-dm.org/uglow/grunt-modular-project#info=devDependencies)

Grunt Modular Project is a set of customisable workflow tasks designed for building JS + HTML + CSS modules into a website.
It has AngularJS/single-page-apps primarily in-mind.
The project transforms a source code folder (`src` by default) into a web-application that can run in development or production mode.

[Change log](CHANGELOG.md)

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-modular-project --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-modular-project');
```

**Currently you will also need to include the Grunt plugins that this plugin uses [package.json](https://github.com/uglow/grunt-modular-project/blob/master/package.json) into your project's `package.json` file.**

## The "grunt-modular-project" task

Example of a project using this plugin: [angular-form-library](https://github.com/uglow/angular-form-lib)


### Overview
In your project's Gruntfile, add a section named `moduleProject` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  modularProject: {
  },
});
```

### <a name="dev"></a> Tasks

From the command line, the following commands are available:
- `grunt install`: Installs commit message hooks for `git` to support [conventional changelog](https://github.com/ajoslin/conventional-changelog/blob/master/CONVENTIONS.md) 
- `grunt dev`: Continuous development (builds debuggable version into `/dev` folder, starts server, watches files for changes and reloads)
- `grunt build`: Builds the site into `/dist`, ready for distribution
- `grunt build:serve`: Builds the site into `/dist`, and then serves it up via a connect webserver
- `grunt test`: Runs Jasmine unit tests `**/unitTest/*.spec.js` in PhantomJS via Karma
- `grunt test:browser`: Runs unit tests in Chrome (useful for debugging)
- `grunt verify:all/src/test`: Checks all/src/test JS code for linting/syntax/style errors
- `grunt release`: Builds the project, checks that all source code is committed and if so, bumps version numbers in `package.json` and `bower.json` (by default), then commits those changes + updated `CHANGELOG.md` with a version tag.
- `grunt release:minor`: As above, but bumps minor version
- `grunt release:major`: As above, but bumps major version


###Key features###
- Source code can be (should be) structured into modules
- No need for "global" folders - create a module called `global` or `anythingYouLike` instead
- Each module can contain:
  - HTML files, which are deployed to `/views/{module}`
  - JS files, which are deployed to `/js/{moduleName}.js` . Note that JS files beginning with "_" will appear *first* inside the `{moduleName}.js` file.
  - `/assets`, which contains *static assets* that are deployed to /assets/{module}. Static assets include images, data files which are needed at run-time.
  - `/docs`, which contains JS and HTML files for component/project documentation. This content is ignored in the production build.
  - `/includes`, which contains files that should be included into other files at **compile-time**. This folder does not get deployed.
  - `/styles`, which contains CSS/SASS/LESS/Stylus files that are deployed to `/css`. The technology you use is up to you (currently uses Stylus).
  - `/unittest`, which contains unit tests (currently Jasmine + Karma, but can be easily changed). This folder does not get deployed.
  - `/partials`, which contains HTML files that are deployed to `/views/{module}/partials`
  - **Sub-modules**! Yes, you can create modules-within-modules (like Java packages).
- Code changes trigger re-compilation (when using `grunt dev`)
- Support for live-reloading is built-in
- File-revving (cache-busting) and image+CSS+HTML+JS optimization for production builds
- Vendor specific libraries such as jQuery can be downloaded via Bower and used by editing `Gruntfile.js` to make them available to web-pages via the `{{vendorScripts}}` template-tag.
- Ability to define your own task-wiring from the provided tasks (not locked-in to the default approach)
- Ability to use special template-tags in HTML pages to refer to `{{vendorScripts}}`, `{{externalScripts}}`, `{{cssFiles}}` and `{{appScripts}}`


#### Default Options
The default options are located in [modularProject.js](https://github.com/uglow/grunt-modular-project/blob/master/tasks/modularProject.js)


The defaults support the following **input** folder structure:

- config
  - jscs
    - .jscsrc
  - jshint
    - .jshint
- src
  - index.html
  - modules
    - **myModule1**
      - _main.js
      - other.js
      - someHtml.html
      - assets
        - font
        - images
      - include
      - partials
        - *.html
      - style
        - *.styl
      - unitTest
        - *.spec.js
      - template
        - componentTemplate.html
    - **myModule2**
      - **withSubModule**
        - assets
        - unitTest
        - ...
      - includes
      - ... 

And they produce the following **output** folder when using `grunt dev`:
- dev
  - index.html
  - assets
    - myModule1
      - font
      - images
  - css
    - *rootFiles and external CSS files*
  - js
    - myModule1.js (contains _main.js THEN all other JS files in the src/modules/module1 folder)
    - myModule2.js
    - withSubModule
      - withSubModule.js
  - vendor
    - *any files specified by `buildHTML.compilableVendorJSFiles` and `buildHTML.nonCompilableVendorJSFiles`*
  - views
    - myModule1
      - *.html
    - myModule2
      - *.html
      - withSubModule
        - *.html
  

And they produce the following **output** folder when using `grunt build`:
- dist
  - *as above except all files are revved & minified & concatenate where applicable, except:*
  - js
    - app.js (all JS files in this folder are concentated and minified into app.js)


### Options

#### input.srcDir
Type: `String`
Default value: `'src/'`

A relative path from the root directory to the source code root directory.

#### input.modulesDir
Type: `String`
Default value: `'src/modules/'`

A relative path from the root directory to the modules directory. It is expected that underneath this directory
are subdirectories representing one-or-more modules, and that these directories can also contain sub-modules.

*More to come...*


### Usage Examples

```js
grunt.initConfig({
  // Configuration to be run (and then tested).
  modularProject: {
    input: {
      // Use the defaults
    },
    output: {
      // Use the defaults
    },
    buildCSS: {
      rootSourceFiles:  ['**/styles/docs.styl', '**/styles/sampleFormStyle.styl'],
      externalCSSFiles: [
        '<%= modularProject.bowerDir %>angular-motion/dist/angular-motion.css',
        '<%= modularProject.bowerDir %>highlightjs/styles/github.css'
      ]
    },
    buildHTML: {
      compiledCSSFiles: [
        'css/angular-motion.css',
        'css/github.css',
        'css/docs.css',
        'css/sampleFormStyle.css'
      ],
      compilableVendorJSFiles: [
        // Order is important - Angular should come first
        '<%= modularProject.bowerDir %>angular/angular.js',
        '<%= modularProject.bowerDir %>angular-animate/angular-animate.js',
        '<%= modularProject.bowerDir %>angular-translate/angular-translate.js',
        '<%= modularProject.bowerDir %>angular-translate-loader-static-files/angular-translate-loader-static-files.js',
        '<%= modularProject.bowerDir %>angular-scroll/angular-scroll.js',
        '<%= modularProject.bowerDir %>angular-strap/dist/angular-strap.js',
        '<%= modularProject.bowerDir %>angular-strap/dist/angular-strap.tpl.js'
      ],
      nonCompilableVendorJSFiles: [
        '<%= modularProject.bowerDir %>highlightjs/highlight.pack.js'
      ]
    },
    // Custom config for building a JS library - used by the mpBuildLibrary task
    buildLibrary: {
      libFileNamePrefix: 'ng-form-lib',
      libSrcFiles: ['**/*.js', '!**/docs.js']
    },
    release: {
      // Modify both the docsConfig.json SRC and the temporary documentation version (in /docs), but only commit the SRC version.
      filesToBump: ['package.json', 'bower.json', 'src/modules/docs/assets/config/docsConfig.json', 'docs/assets/docs/config/docsConfig.json'],
      filesToCommit: ['package.json', 'bower.json', 'CHANGELOG.md', 'src/modules/docs/assets/config/docsConfig.json'],
      tasks: ['releaseDocs']
    },
    optimise: {
      tasks: [
        'mpBuildLibrary',       // New task
        'clean:optimised',
        'concurrent:optimisedImages',
        'copy:optimised',
        'concat:optimised', 'uglify:optimised',
        'mpOptimiseHTMLTags', 'targethtml:optimised',
        'filerev:optimised', 'useminOptimised',
        'htmlmin:optimised', 'usebanner'
        'beep:twobits'          // Beep at the end
      ]
    },
    unitTest: {
      testLibraryFiles: [
        '<%= modularProject.buildHTML.compilableVendorJSFiles %>',
        '<%= modularProject.bowerDir %>angular-mocks/angular-mocks.js'
      ]
    }
  }
});
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

[List of contributors - could be you!](CONTRIBUTORS.md)
