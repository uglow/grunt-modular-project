## 0.5.0 (2015-02-25)


#### Features

* **modularity:** Make it easier to replace default tasks ([4278af1a](http://github.com/uglow/grunt-modular-project/commit/4278af1a94f9de32b7444a322a161babd83cdc86))


#### Breaking Changes

* Your Gruntfile.js will need to manually load the default tasks now.
The reason for this change is that there will come a time when you out-grow the default settings.
So you can replace `grunt.loadTasks('node_modules/grunt-modular-project/tasks/serve')` with
`grunt.loadTasks('myConfig/grunt')` (to load your own serve.js task).

 ([4278af1a](http://github.com/uglow/grunt-modular-project/commit/4278af1a94f9de32b7444a322a161babd83cdc86))


### 0.4.10 (2015-02-23)


#### Features

* **unitTest:** Make it easier to override the jUnitReporter config ([a01cf5d9](http://github.com/uglow/grunt-modular-project/commit/a01cf5d90987f060bf35ab55dd3994a751f33c6c))


### 0.4.9 (2015-02-20)


#### Bug Fixes

* **e2e:** Exclude e2e tests when running unit tests, by default. ([26927e68](http://github.com/uglow/grunt-modular-project/commit/26927e685353a4db030cbcb3ed67770fa3db11b0))


### 0.4.8 (2015-02-20)


#### Bug Fixes

* **verify:** Refer to `verify:xxx` task instead of it's implementation in `watch:allJSSrc` ([69603c70](http://github.com/uglow/grunt-modular-project/commit/69603c70fc5f95dbbad8d10df4370e20cfb28b9c))


#### Features

* **e2e:** Support e2e test specs by excluding them from the JS build. ([199cc149](http://github.com/uglow/grunt-modular-project/commit/199cc14966f3f65609edb45173ed2c3a4cc0f75e))


### 0.4.7 (2015-02-19)


#### Bug Fixes

* **coverage:** Add a task to the `coverage` config to make it run correctly ([d1a092b1](http://github.com/uglow/grunt-modular-project/commit/d1a092b1af4c0d21d9c87982b62d461e1a539cf1))


### 0.4.6 (2015-02-19)


#### Features

* **unitTest:** Make `test` task easier to configure ([382b75c7](http://github.com/uglow/grunt-modular-project/commit/382b75c71aa8a0a70192a8edc69e24291e68cca6))


### 0.4.5 (2015-02-19)


#### Features

* **install:** Attempt to make `install` more flexible, still not working Win7 (degrades nicely ([5dce59c3](http://github.com/uglow/grunt-modular-project/commit/5dce59c34b2db0f8381e08d085d91231ff943e2d))


### 0.4.4 (2015-02-19)


#### Features

* **build:** Make running tests part of `build` and remove test-task indirection ([d64fa7b8](http://github.com/uglow/grunt-modular-project/commit/d64fa7b83601cc2d3643731871ce119644bf87f7))


### 0.4.3 (2015-02-18)


#### Features

* **optimise:** Change 'optimise' to use a consistent pattern for defining tasks ([eb686d90](http://github.com/uglow/grunt-modular-project/commit/eb686d90e3cf67a6e65af6af3feca68800785494))


### 0.4.2 (2015-02-17)


#### Bug Fixes

* **cssCompilation:** Link the compilation task to the watch task ([4f481516](http://github.com/uglow/grunt-modular-project/commit/4f48151666bd386fcd1e6b9595d3fb947e260cdb))


### 0.4.1 (2015-02-17)


#### Features

* **cssCompilation:** Make it easier to change CSS compilation task ([fb7639ce](http://github.com/uglow/grunt-modular-project/commit/fb7639ce3a90d226bfdbb90b9cf6516cd72da720))


## 0.4.0 (2015-02-13)


#### Bug Fixes

* **imageOptim:** Fix incorrect path when optimising images ([ba320462](http://github.com/uglow/grunt-modular-project/commit/ba320462cccc686fe99aeae168803311c01bb70f))


#### Features

* **devDependencies:** Update to latest dependencies ([f9934ebc](http://github.com/uglow/grunt-modular-project/commit/f9934ebcbb277f7871a66fdacad6fe89c46fbffb))
* **it:** Add 'jig-grunt' plugin to reduce load & run times ([f35ee922](http://github.com/uglow/grunt-modular-project/commit/f35ee922291d4aa7ae2e521a2042b9a889a314af))
* **verify:** Add support for customising the Verify workflow-task ([12a3e84b](http://github.com/uglow/grunt-modular-project/commit/12a3e84bd9ce1c081daa75755ea35837a3ce07b9))


<a name="0.3.8"></a>
### 0.3.8 (2015-02-10)


#### Features

* **banner:** Add support for adding banners to files. ([94883635](http://github.com/uglow/grunt-modular-project/commit/94883635ea89aeaa8771ad03ab29fc7f40600afb))


<a name="0.3.7"></a>
### 0.3.7 (2015-02-08)


#### Bug Fixes

* **read:** Use correct link to example project ([99038776](http://github.com/uglow/grunt-modular-project/commit/9903877624db2f9d9344b33fe90d5d1c7f41d1ee))


<a name="0.3.6"></a>
### 0.3.6 (2015-01-16)


#### Features

* **uglify:** Add missing uglify optimisation for /dev/js/**/*.js files (by default) ([5a26b863](http://github.com/uglow/grunt-modular-project/commit/5a26b8634907699db65c7cb22aa817bb4c325aee))


<a name="0.3.5"></a>
### 0.3.5 (2015-01-16)


#### Features

* **compression:** Add support for gzip compression via the connect server ([62244fc7](http://github.com/uglow/grunt-modular-project/commit/62244fc70191ba5c46dc779cf6430e01a8c5466a))
* **templateTag:** Add {{appScripts}} tag to be replaced by module script-tags in HTML ([4b14013f](http://github.com/uglow/grunt-modular-project/commit/4b14013f7ee5c19f068153af01a43cb3ebcf0e32))


<a name="0.3.3"></a>
### 0.3.3 (2015-01-09)


#### Bug Fixes

* **readme:** Fixed incorrect module configuration name to `modularProject` ([773ef2f9](http://github.com/uglow/grunt-modular-project/commit/773ef2f90683876ff1b5c061a1a96b03594683e9))


<a name="0.3.2"></a>
### 0.3.2 (2015-01-09)


#### Features

* **build:** Added reference to Gruntfile.js and project using this plugin ([42424ebd](http://github.com/uglow/grunt-modular-project/commit/42424ebdda72dc0760ba2eae4c1ad4d901a69cd2))


<a name="0.3.1"></a>
### 0.3.1 (2015-01-09)


#### Features

* **build:** Remove `releaseDocs` task and surface the allJSSrc watch task for customisation ([c8389734](http://github.com/uglow/grunt-modular-project/commit/c838973481bfd5ec3933431c0ad7ca4381f28075))


<a name="0.3.0"></a>
## 0.3.0 (2015-01-09)


#### Features

* **optimise:** Remove buildDocs & buildSite and replace with 'optimise' task which supports bot ([b190aa13](http://github.com/uglow/grunt-modular-project/commit/b190aa132adaab21769fa9e62b14b9dd00f12e69))


<a name="0.2.0"></a>
## 0.2.0 (2015-01-08)


#### Features

* **refactor:** Simplify public API ([6c2db56f](http://github.com/uglow/grunt-modular-project/commit/6c2db56f655a0fab95fea76406251062b96699f3))


<a name="0.1.5"></a>
### 0.1.5 (2015-01-08)


#### Bug Fixes

* **packaging:** Change npmignore so that legitimate /lib folder is included, but root /lib is no ([97f9a676](http://github.com/uglow/grunt-modular-project/commit/97f9a6763eb410ca666ce2795e50255a8a419308))


<a name="0.1.4"></a>
### 0.1.4 (2015-01-08)


#### Bug Fixes

* **paths:** Use path.resolve to fetch library file. ([43aa970e](http://github.com/uglow/grunt-modular-project/commit/43aa970e5dd79c4ad83b8d6d390e3418c679a8d4))


<a name="0.1.3"></a>
### 0.1.3 (2015-01-08)


#### Bug Fixes

* **dependencies:** Remove sequencing-dependency on when tasks are loaded. ([91cb8229](http://github.com/uglow/grunt-modular-project/commit/91cb8229f4df82f49c7ff3a98f62aa58c1c876b2))


<a name="0.1.2"></a>
### 0.1.2 (2015-01-07)


#### Bug Fixes

* **clean:** Remove unused files and update README.md ([1c8d4026](http://github.com/uglow/grunt-modular-project/commit/1c8d4026e03d341d075a13572eb41d6b627b870d))


<a name="0.1.1"></a>
### 0.1.1 (2015-01-07)


<a name="0.1.0"></a>
## 0.1.0 (2015-01-07)

