# [grunt-modular-project](https://github.com/uglow/grunt-modular-project)
This is a library of GruntJS tasks for building JS/HTML/CSS modules into a website.
It has AngularJS/single-page-apps primarily in-mind.
The project transforms a source code folder (`src` by default) into
a web-application that can run in development or production mode.

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


## <a name="dev"></a> Tasks

From the command line, you can run the following commands:

- `grunt dev`: Continuous development (builds debuggable version into `/dev` folder, starts server, watches files for changes and reloads)
- `grunt build`: Builds the site into `/dist`, ready for distribution
- `grunt build:serve`: Builds the site into `/dist`, and then serves it up
- `grunt test`: Runs Jasmine unit tests `**/unitTest/*.spec.js` in PhantomJS via Karma
- `grunt test:browser`: Runs unit tests in Chrome (useful for debugging)

# Notes
- If Grunt throws errors for missing dependencies try installing them manually through npm install *filename*
- If node has permission errors ensure that it has ownership of the global directory.




## The "modular_project" task

### Overview
In your project's Gruntfile, add a section named `moduleProjectConfig` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  moduleProjectConfig: {
    options: {
      // Task-specific options go here.
    }
    // Extra config
  },
});
```

### Options - Coming Soon

#### options.separator
Type: `String`
Default value: `',  '`

A string value that is used to do something with whatever.

#### options.punctuation
Type: `String`
Default value: `'.'`

A string value that is used to do something else with whatever else.

### Usage Examples - Coming Soon

#### Default Options
In this example, the default options are used to do something with whatever. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result would be `Testing, 1 2 3.`

```js
grunt.initConfig({
  modular_project: {
    options: {},
    files: {
      'dest/default_options': ['src/testing', 'src/123'],
    },
  },
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
