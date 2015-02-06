/*
 * grunt-mustache-hogan-html
 * https://github.com/rocco/grunt-mustache-hogan-html
 * 
 * Copyright (c) 2015 rocco
 * 
 * based on grunt-mustache-html
 * https://github.com/haio/grunt-mustache-html
 *
 * Copyright (c) 2013 zhongyu
 
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('mustache_hogan_html', 'Compile Mustache templates to HTML unsing Hogan.js', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      src: 'src',
      dist: 'dist',
      type: 'mustache'
    });

    var globals = this.data.globals || {};

    var hogan = require('hogan.js'),
        jstSuffix = '.' + options.type,
        matcher = new RegExp('\\' + jstSuffix + '$');

   // hogan.compile each partial, return object of compiled partials
    var compilePartials = function (partialPath) {

        console.log('- using partial path: %s', partialPath);
        var allPartials = {};

        // for all files in dir
        grunt.file.recurse(partialPath, function (abspath, rootdir, subdir, filename) {

            // file extension does not match
            if (!filename.match(matcher)) {
                console.log('-- ignoring file: %s', filename);
                return;
            }

            var partialName = filename.replace(matcher, ''),
                partialSrc = grunt.file.read(abspath);

            console.log('-- compiling partial: %s', filename);
            allPartials[partialName] = hogan.compile(partialSrc); // , { sectionTags: [{o:'_i', c:'i'}] }

        });

        return allPartials;
    };

    // hogan render each page, return rendered pages
    var compilePages = function (pagesPath, allPartials) {

        console.log('- using pages path: %s', pagesPath);
        var allPages = {};

        // for all files in dir
        grunt.file.recurse(pagesPath, function (abspath, rootdir, subdir, filename) {

            // file extension does not match
            if (!filename.match(matcher)) {
                console.log('-- ignoring file: %s', filename);
                return;
            }

            var pageName = filename.replace(matcher, ''),
                pageSrc = grunt.file.read(abspath),
                pageData = {},
                dataPath = abspath.replace(matcher, '.json'),
                locals = merge({}, globals);

            console.log('-- compiling page: %s', filename);
            var compiledPage = hogan.compile(pageSrc); // , { sectionTags: [{o:'_i', c:'i'}] }

            // read page data from {pageName}.json

            console.log('--- looking for page data in: %s', dataPath);
            if (grunt.file.exists(dataPath)) {
                pageData = JSON.parse(grunt.file.read(dataPath), function (key, value) {
                    if (value && (typeof value === 'string') && value.indexOf('function') === 0) {
                        try {
                            return new Function('return ' + value)();
                        } catch (ex) {
                            //faulty function, just return it as a raw value
                        }
                    }
                    return value;
                });
                merge(locals, pageData);
                pageData[pageName] = locals;
            }

            allPages[pageName] = compiledPage.render(locals, allPartials);

        });

        return allPages;

    };

    var each = function (obj, iter) {
        var keys = Object.keys(obj);
        for (var i=0,l=keys.length; i<l; i++) {
            iter.call(null, obj[keys[i]], keys[i]);
        }
    };

    var merge = function (init, extended) {
      each(extended, function(v, k) {
        init[k] = v;
      });

      return init;
    };

    // get paths
    var layoutPath  = options.src + '/layout' + jstSuffix,
        pagePath    = options.src + '/pages',
        partialPath = options.src + '/partials';

    // render partials and pages with partial data
    var pageData = {}, // filled in compilePages
        partials = compilePartials(partialPath),
        pages    = compilePages(pagePath, partials);

    // get layout and compile it
    var layoutSrc  = grunt.file.read(layoutPath),
        layoutComp = hogan.compile(layoutSrc); //, { sectionTags: [{o:'_i', c:'i'}] });

    // for each page (which are only partials after all) render an HTML file
    each(pages, function (page, name) {
        // add page as a partial called {{>content}}
        partials.content = page;
        // render actual page using layout and all partials (including pages now)
        var htmlContent = layoutComp.render(pageData[name] || {}, partials);
        // write HTML file
        grunt.file.write(options.dist  + '/' + name + '.html', htmlContent);
        console.log('wrote HTML file: %s', options.dist  + '/' + name + '.html');
    });

  });
};
