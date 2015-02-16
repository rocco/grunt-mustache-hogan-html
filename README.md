# grunt-mustache-hogan-html

[![bitHound Score](https://www.bithound.io/rocco/grunt-mustache-hogan-html/badges/score.svg)](https://www.bithound.io/rocco/grunt-mustache-hogan-html)

Compiles static HTML files from a defined structure of mustache templates using Hogan.js.
Also provides a base layout fir all generated files. 

Works nice for HTML docs or clickdummies.


## Getting Started
This is a plugin for [Grunt](http://gruntjs.com/getting-started).
Install this plugin with this command:

```shell
npm install grunt-mustache-hogan-html --save-dev
```

Once the plugin has been installed, it may be enabled inside your `Gruntfile.js` like this:

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
 ├── globals.json
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

* `layout.mustache` must exist and contain `{{> content}}` to put page content in
* `globals.json` is optional and contains global values for mustache variables
* `pages/` contains page templates that are transformed into HTML files
* `pages/*.json` files contain page-specific data, can be also rendered in the layout
* `partials/` contains the partial templates that might be used in the page templates

#### options.dist
Type: `String`
Default value: `dist`

Destination directory of rendered HTML files.

#### globals
Type: `Object`
Default value: {}

Contains global data. 
Keys can be overwritten with values from `globals.json` and page-specific values from `pages/*.json` files.

## Test

```bash
grunt test
```

## Contributing
You are very welcome to contribute!
Stick to the existing coding style.
Add unit tests for new functionality.
Lint your code.

## Props
This project is based on [grunt-mustache-html by zhongyu](https://github.com/haio/grunt-mustache-html).
Due to heavy restructuring and functionality changes this is no regular fork anymore.
