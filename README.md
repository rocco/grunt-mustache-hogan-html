# grunt-mustache-hogan-html

Compiles static HTML files from a defined structure of mustache templates using Hogan.js.
Also provides a base layout fir all generated files. 

Works nice for HTML docs or clickdummies.

## Getting Started
This plugin requires Grunt `~0.4.2`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-mustache-hogan-html --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-mustache-hogan-html');
```

## The "mustache_hogan_html" task

### Overview
Generate static HTML files from mustache templates using Hogan.js.
Make use of layouts and nested partials.

```js
grunt.initConfig({
  mustache_hogan_html: {
    development: {
      options: {
        src: 'src',
        dist: 'dist'
      },
      globals: {
        analytics_id: 'UA-123456-1'
      }
    }
  }
});
```

Now the subtask `mustache_hogan_html:development` is available. Add further targets (such as `build` as desired).

### Options object

#### options.src
Type: `String`
Default value: `src`

The source directory of your templates, the directory should be structured like:

```txt
src/
 ├── layout.mustache
 ├── pages
 │   └── index.json
 │   └── index.mustache
 │   └── 404.json
 │   └── 404.mustache
 └── partials
     └── header.mustache
     └── nav.mustache
     └── footer.mustache
```

* `layout.mustache` must exist 
* `pages` folder contains the page templates that are transformed into HTML files
* `.json` files in `pages` folder contain page specify data, can be also rendered in layout page
* `partials` contains the partial templates that might be used in the page templates

#### options.dist
Type: `String`
Default value: `dist`

Destination directory of rendered HTML files.

#### globals
Type: `Object`
Default value: {}

Contains global data. Same keys will be overwritten by page-specific values from `.json` files.

## Test

```bash
grunt test
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality.
Lint and test your code

## Props
This project is based on [grunt-mustache-html by zhongyu](https://github.com/haio/grunt-mustache-html)
