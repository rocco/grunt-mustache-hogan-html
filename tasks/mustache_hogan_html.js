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
		    jstSuffix = '.' + options.type,
		    matcher = new RegExp('\\' + jstSuffix + '$');

		// Hogan.compile each partial, return object of compiled partials
		var compilePartials = function (partialPath) {

			if (options.verbose) {
				grunt.log.writeln('- using partial path: %s', partialPath);
			}
			var allPartials = {};

			// for all files in dir
			grunt.file.recurse(partialPath, function (abspath, rootdir, subdir, filename) {

				// file extension does not match
				if (!filename.match(matcher)) {
					if (options.verbose) {
						grunt.log.writeln('-- ignoring file: %s', filename);
					}
					return;
				}

				var partialName = filename.replace(matcher, ''),
				    partialSrc = grunt.file.read(abspath);

				if (options.verbose) {
					grunt.log.writeln('-- compiling partial: %s', filename);
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
			grunt.file.recurse(pagesPath, function (abspath, rootdir, subdir, filename) {

				// file extension does not match - ignore
				if (!filename.match(matcher)) {
					if (options.verbose) {
						grunt.log.writeln('-- ignoring file: %s', filename);
					}
					return;
				}

				var pageName = filename.replace(matcher, ''),
				    pageSrc = grunt.file.read(abspath),
				    pageJson = {},
				    dataPath = abspath.replace(matcher, '.json'),
				    compiledPage = Hogan.compile(pageSrc); // , { sectionTags: [{o:'_i', c:'i'}] }

				if (options.verbose) {
					grunt.log.writeln('-- compiled page: %s', filename);
				}

				// read page data from {pageName}.json
				if (grunt.file.exists(dataPath)) {
					if (options.verbose) {
						grunt.log.writeln('--- using page data from: %s', dataPath);
					}
					pageJson = grunt.file.readJSON(dataPath);
					pageData[pageName] = mergeObj(gruntGlobals, pageJson);
				} else {
					pageData[pageName] = gruntGlobals;
				}

				allPages[pageName] = compiledPage.render(pageData[pageName], allPartials);
			});

			return allPages;
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

		var layoutPath = options.src + '/layout' + jstSuffix,
		    pagePath = options.src + '/pages',
		    partialPath = options.src + '/partials',
		    // render partials and pages with partial data
		    pageData = {}, // filled in compilePages
		    partials = compilePartials(partialPath),
		    pages = compilePages(pagePath, partials),
		    // get layout and compile it
		    layoutSrc = grunt.file.read(layoutPath),
		    layoutComp = Hogan.compile(layoutSrc);

		// for each page (which are only partials after all) render an HTML file
		var fileCount = 0;
		each(pages, function (page, name) {
			// add page as a partial called {{>content}}
			partials.content = page;

			// render actual page using layout and all partials (including pages now)
			var htmlContent = layoutComp.render(pageData[name] || {}, partials);

			// write HTML file
			grunt.file.write(options.dist  + '/' + name + '.html', htmlContent);
			if (options.verbose) {
				grunt.log.writeln('wrote HTML file: %s', options.dist  + '/' + name + '.html');
			}
			fileCount++;
		});

		grunt.log.ok(fileCount + ' HTML ' + grunt.util.pluralize(fileCount, 'file/files') + ' written');

	});
};
