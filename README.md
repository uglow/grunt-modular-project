# [grunt-modular-project](https://github.com/uglow/grunt-modular-project)
[![npm version](https://badge.fury.io/js/grunt-modular-project.svg)](http://badge.fury.io/js/grunt-modular-project)
[![devDependency Status](https://david-dm.org/uglow/grunt-modular-project/dev-status.svg)](https://david-dm.org/uglow/grunt-modular-project#info=devDependencies)

Grunt Modular Project is a set of customisable workflow tasks designed for building JS + HTML + CSS modules into a website.
It has AngularJS/single-page-apps primarily in-mind.
The project transforms a source code folder (`src` by default) into a web-application that can run in development or production mode.

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

## The "grunt-modular-project" task

Example of a project using this plugin: [angular-form-library](https://github.com/uglow/angular-form-lib)

###Key features###
- Source code is structured into modules
- No need for "global" folders - create a module called `global` instead
- Each module can contain:
  - HTML files, which are deployed to `/views/{module}`
  - JS files, which are deployed to `/js/{moduleName}.js` . Note that JS files beginning with "_" will appear *first* inside the `{moduleName}.js` file.
  - `/assets`, which contains *static assets* that are deployed to /assets/{module}. Static assets include images, data files which are needed at run-time.
  - `/docs`, which contains JS and HTML files for component/project documentation. This content is ignored in the production build.
  - `/includes`, which contains files that should be included into other files at **compile-time**. This folder does not get deployed.
  - `/styles`, which contains CSS/SASS/LESS/Stylus files that are deployed to `/css`. The technology you use is up to you (currently uses Stylus).
  - `/unittest`, which contains unit tests (currently Jasmine + Karma, but can be easily changed). This folder does not get deployed.
  - `/partials`, which contains HTML files that are deployed to `/views/{module}/partials`
  - **sub-modules**! Yes, you can create modules-within-modules (like Java packages).
- Code changes trigger re-compilation (when using `grunt dev`)
- Support for live-reloading is built-in
- File-revving (cache-busting) and image+CSS+HTML+JS optimization for production builds
- Vendor specific libraries such as jQuery can be downloaded via Bower and used by editing `Gruntfile.js` to make them available to web-pages via the `{{vendorScripts}}` template-tag.
- Ability to define your own task-wiring from the provided tasks (not locked-in to the default approach)
- Ability to use special template-tags in HTML pages to refer to `{{vendorScripts}}`, `{{externalScripts}}`, `{{cssFiles}}` and `{{appScripts}}`


### <a name="dev"></a> Tasks

From the command line, the following commands are available:
- `grunt install`: Installs commit message hooks for git to support [conventional changelog](https://github.com/ajoslin/conventional-changelog/blob/master/CONVENTIONS.md) 
- `grunt dev`: Continuous development (builds debuggable version into `/dev` folder, starts server, watches files for changes and reloads)
- `grunt build`: Builds the site into `/dist`, ready for distribution
- `grunt build:serve`: Builds the site into `/dist`, and then serves it up via a connect webserver
- `grunt test`: Runs Jasmine unit tests `**/unitTest/*.spec.js` in PhantomJS via Karma
- `grunt test:browser`: Runs unit tests in Chrome (useful for debugging)
- `grunt verify:all/src/test`: Checks all/src/test JS code for linting/syntax/style errors
- `grunt release`: Builds the project, checks that all source code is committed and if so, bumps version numbers in `package.json` and `bower.json` (by default), then commits those changes + updated `CHANGELOG.md` with a version tag.
- `grunt release:minor`: As above, but bumps minor version
- `grunt release:major`: As above, but bumps major version


### Overview
In your project's Gruntfile, add a section named `moduleProject` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  modularProject: {
  },
});
```

#### Default Options
These are the configurable default options for this task:

```js
grunt.initConfig({
  modularProject: {
    input: {
      srcDir: 'src/',
      modulesDir: 'src/modules/',
      moduleAssets: 'assets',
      moduleIncludes: 'includes',
      modulePartials: 'partials',
      moduleStyles: 'styles',
      moduleTemplates: 'template',
      moduleUnitTest: 'unitTest',
      assetFiles: ['**/<%= modularProject.input.moduleAssets %>/**/*'],
      htmlFiles: ['**/*.html'],
      jsFiles: ['**/_*.js', '**/*.js'],
      templateHTMLFiles: ['**/<%= modularProject.input.moduleTemplates %>/*.html']
    },
    output: {
      devDir: 'dev/',
      prodDir: 'dist/',
      reportDir: 'reports/',
      assetsSubDir: 'assets/',
      cssSubDir: 'css/',
      jsSubDir: 'js/',
      vendorJSSubDir: 'vendor/',
      viewsSubDir: 'views/'
    },
    build: {
      tasks: ['mpBuildInit', 'mpBuildIncludes', 'mpBuildJS', 'mpBuildCSS', 'mpBuildHTML', 'mpVerify:all'],
    },
    buildCSS: {
      rootSourceFiles: [],
      externalCSSFiles: [],
    },
    buildHTML: {
      compiledCSSFiles: [],
      compilableVendorJSFiles: [],
      nonCompilableVendorJSFiles: [],
    },
    optimise: {
      tasks: [
        'clean:optimised',
        'concurrent:optimisedImages',
        'copy:optimised',
        'concat:optimised', 'uglify:optimised',
        'mpOptimiseHTMLTags', 'targethtml:optimised',
        'filerev:optimised', 'useminOptimised',
        'htmlmin:optimised', 'usebanner'
      ],
      preOptimisedAssetFiles: [
        '*/font/**/*',
        '*/language/**/*',
        '*/config/**/*'
      ],
      jsMinFile: 'app.js'
    },
    optimise: {
      tasks: [
        'clean:optimised',
        'concurrent:optimisedImages',
        'copy:optimised',
        'concat:optimised', 'uglify:optimised',
        'mpOptimiseHTMLTags', 'targethtml:optimised',
        'filerev:optimised', 'useminOptimised',
        'htmlmin:optimised', 'usebanner'
      ],
    },
    release: {
      filesToBump: ['package.json', 'bower.json'],
      filesToCommit: ['package.json', 'bower.json', 'CHANGELOG.md'],
      tasks: []
    },
    serve: {
      dev: {
        port: 8000,
        hostname: 'localhost'
      },
      prod: {
        port: 8000,
        hostname: 'localhost'
      }
    },
    test: {
      tasks: {
        unitTest: ['mpUnitTest'],
        unitTestBrowser: ['karma:browser']
      }
    },
    verify: {
      reportDir: '<%= modularProject.output.reportDir %>',
      jshint: {
        baseConfig: '<%= modularProject.config.dir %>jshint/.jshintrc',
        testConfig: '<%= modularProject.config.dir %>jshint/.jshintrc',
        CIConfig: '<%= modularProject.config.dir %>jshint/.jshintrc'
      },
      jscs: {
        baseConfig: '<%= modularProject.config.dir %>jscs/.jscsrc',
        testConfig: '<%= modularProject.config.dir %>jscs/.jscsrc',
        CIConfig: '<%= modularProject.config.dir %>jscs/.jscsrc'
      }
    }
  },
});
```

The above defaults support the following **input** folder structure:

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
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Git Commit Guidelines

These rules are adopted from [the AngularJS commit conventions](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/).

### Commit Message Format

Each commit message starts with a **type**, a **scope**, and a **subject**.

Below that, the commit message has a **body**.

- **type**: what type of change this commit contains.
- **scope**: what item of code this commit is changing.
- **subject**: a short description of the changes.
- **body** (optional): a more in-depth description of the changes

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
```

Examples:

```
feat(ruler): add inches as well as centimeters
```

```
fix(protractor): fix 90 degrees counting as 91 degrees
```

```
refactor(pencil): use graphite instead of lead

Closes #640.

Graphite is a much more available resource than lead, so we use it to lower the price.
```

```
fix(pen): use blue ink instead of red ink

BREAKING CHANGE: Pen now uses blue ink instead of red.

To migrate, change your code from the following:

`pen.draw('blue')`

To:

`pen.draw('red')`
```

Any line of the commit message should not be longer 100 characters. This allows the message to be easier
to read on github as well as in various git tools.

### Type
Is recommended to be one of the below items. Only **feat** and **fix** show up in the changelog, in addition to breaking changes (see breaking changes section at bottom).

* **feat**: A new feature
* **fix**: A bug fix
* **docs**: Documentation only changes
* **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing
  semi-colons, etc)
* **refactor**: A code change that neither fixes a bug or adds a feature
* **test**: Adding missing tests
* **chore**: Changes to the build process or auxiliary tools and libraries such as documentation
  generation

### Scope
The scope could be anything specifying place of the commit change. For example `$location`,
`$browser`, `$compile`, `$rootScope`, `ngHref`, `ngClick`, `ngView`, etc...

### Subject
The subject contains succinct description of the change:

* use the imperative, present tense: "change" not "changed" nor "changes"
* don't capitalize first letter
* no dot (.) at the end

### Breaking Changes
Put any breaking changes with migration instructions in the commit body.

If there is a breaking change, put **BREAKING CHANGE:** in your commit body, and it will show up in the changelog.
