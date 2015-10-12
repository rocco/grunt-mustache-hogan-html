/*
 * grunt-mustache-hogan-html
 * https://github.com/rocco/grunt-mustache-hogan-html
 *
 * Copyright (c) 2015 Rocco Georgi
 *
 * based on grunt-mustache-html
 * https://github.com/haio/grunt-mustache-html
 *
 * Copyright (c) 2013 zhongyu

 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
	grunt.registerMultiTask('mustache_hogan_html', 'Compile Mustache templates to HTML unsing Hogan.js', function () {
		// Merge task-specific and/or target-specific options with these defaults.
		var options = this.options({
		    	src: 'src',
		    	dist: 'dist',
		    	type: 'mustache',
		    	verbose: grunt.option('verbose')
		    }),
		    Hogan = require('hogan.js'),
		    // global data from Gruntfile
		    gruntGlobals = this.data.globals || {},
		    // fileGlobals wil be filled from file in [src]/globals.json
		    fileGlobals = {},
		    tplFiletype = '.' + options.type,
		    tplMatcher = new RegExp('\\' + tplFiletype + '$');

		// Hogan.compile each partial, return object of compiled partials
		var compilePartials = function (partialPath) {

			if (options.verbose) {
				grunt.log.writeln('- using partial path: %s', partialPath);
			}
			var allPartials = {};

			// for all files in dir
			grunt.file.recurse(partialPath, function (absPath, rootDir, subDir, fileName) {

				// file extension does not match
				if (!fileName.match(tplMatcher)) {
					if (options.verbose) {
						grunt.log.writeln('-- ignoring file: %s', fileName);
					}
					return;
				}

				var partialName = absPath.replace(rootDir, '').replace(tplMatcher, '').substring(1),
				    partialSrc = grunt.file.read(absPath);

				if (options.verbose) {
					grunt.log.writeln('-- compiling partial: %s', partialName);
				}
				allPartials[partialName] = Hogan.compile(partialSrc); // , { sectionTags: [{o:'_i', c:'i'}] }
			});
			return allPartials;
		};

		// Hogan render each page, return rendered pages
		var compilePages = function (pagesPath, allPartials) {
			if (options.verbose) {
				grunt.log.writeln('- using pages path: %s', pagesPath);
			}
			var allPages = {};

			// load fileGlobals from file in [src]/globals.json
			if (grunt.file.exists(options.src + '/globals.json')) {
				fileGlobals = grunt.file.readJSON(options.src + '/globals.json');
				gruntGlobals = mergeObj(gruntGlobals, fileGlobals);
			}

			// for all files in dir
			grunt.file.recurse(pagesPath, function (absPath, rootDir, subDir, fileName) {

				// file extension does not match - ignore
				if (!fileName.match(tplMatcher)) {
					if (options.verbose) {
						grunt.log.writeln('-- ignoring file: %s', fileName);
					}
					return;
				}

				var pageName = absPath.replace(rootDir, '').replace(tplMatcher, '').substring(1),
				    pageSrc = grunt.file.read(absPath),
				    pageJson = {},
				    dataPath = absPath.replace(tplMatcher, '.json'),
				    compiledPage = Hogan.compile(pageSrc); // , { sectionTags: [{o:'_i', c:'i'}] }

				if (options.verbose) {
					grunt.log.writeln('-- compiled page: %s', pageName);
				}

				// read page data from {pageName}.json
				if (grunt.file.exists(dataPath)) {
					if (options.verbose) {
						grunt.log.writeln('--- using page data from: %s', dataPath);
					}
					pageJson = grunt.file.readJSON(dataPath);

					// find strings with functions in JSON and replace by its value
					traverse(pageJson, process);

					pageData[pageName] = mergeObj(gruntGlobals, pageJson);

					if (options.verbose) {
						grunt.log.writeln('--- json for %s', pageName, pageData[pageName]);
					}
				} else {
					pageData[pageName] = gruntGlobals;
				}

				allPages[pageName] = compiledPage.render(pageData[pageName], allPartials);
			});

			return allPages;
		};

		// based on "Traverse all the Nodes of a JSON Object Tree with JavaScript" - http://stackoverflow.com/a/722732
		// called with every property and it's value
		var process = function (key, value, o) {
			if ((typeof value === 'string') && value.indexOf('function') === 0) {
				try {
					var newValue = new Function('return ' + value)()();
					o[key] = newValue;
				} catch (ex) {
					//faulty function, just return it as a raw value
				}
			}
		};
		var traverse = function (o, func) {
			for (var i in o) {
				func.apply(this, [i, o[i], o]);
				if (o[i] !== null && typeof(o[i]) == "object") {
					//going on step down in the object tree!!
					traverse(o[i], func);
				}
			}
		};

		var each = function (obj, iter) {
			var keys = Object.keys(obj);
			for (var i=0,l=keys.length; i<l; i++) {
				iter.call(null, obj[keys[i]], keys[i]);
			}
		};

		var mergeObj = function (baseObj, extensionObj) {
			var retObj = {};
			each(baseObj, function (v, k) {
				retObj[k] = v;
			});
			each(extensionObj, function (v, k) {
				retObj[k] = v;
			});
			return retObj;
		};

		var pagePath = options.src + '/pages',
		    partialPath = options.src + '/partials',
		    // render partials and pages with partial data
		    pageData = {}, // filled in compilePages
		    partials = compilePartials(partialPath),
		    pages = compilePages(pagePath, partials);

		// for each page (which are only partials after all) render an HTML file
		var fileCount = 0;
		each(pages, function (page, name) {

			// get layout for this sub-project and compile it
			var layoutSuffix = name.substring(0, name.lastIndexOf('/')).replace('/', '-'),
			    layoutPath = options.src + '/layout' + (layoutSuffix !== '' ? '-' + layoutSuffix : '') + tplFiletype,
			    layoutSrc = grunt.file.exists(layoutPath) ? grunt.file.read(layoutPath) : grunt.file.read(options.src + '/layout' + tplFiletype),
			    layoutComp = Hogan.compile(layoutSrc);

			// add page as a partial called {{>content}}
			partials.content = page;

			// render actual page using layout and all partials (including pages now)
			var htmlContent = layoutComp.render(pageData[name] || {}, partials);

			// write HTML file
			if (options.verbose) {
				grunt.log.writeln('will write page with name %s', name, page);
			}
			grunt.file.write(options.dist  + '/' + name + '.html', htmlContent);
			if (options.verbose) {
				grunt.log.writeln('wrote HTML file: %s', options.dist  + '/' + name + '.html');
			}
			fileCount++;
		});

		grunt.log.ok(fileCount + ' HTML ' + grunt.util.pluralize(fileCount, 'file/files') + ' written');

	});
};
