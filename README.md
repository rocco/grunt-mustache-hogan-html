# grunt-mustache-hogan-html

[![bitHound Score](https://www.bithound.io/rocco/grunt-mustache-hogan-html/badges/score.svg)](https://www.bithound.io/rocco/grunt-mustache-hogan-html)

Compiles *static HTML* files from a defined structure of *Mustache templates* using a *common base layout*.
As a result you get several HTML pages you can link to from each other: *a working HTML click-dummy*.
Pages can be rendered in folders. 
The *common base layout* can be overridden for each folder.

Great for generating Front-End mockups, HTML documentation etc.

Uses Hogan.js to compile Mustache.


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
Generate static HTML files from mustache templates.
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

Now the subtask `mustache_hogan_html:development` is available.
Add further targets (such as `build` as desired).

### Options object

#### options.src
Type: `String`
Default value: `src`

The source directory of your templates, the directory should be structured like:

```txt
src/
 ├── layout.mustache *
 ├── layout-somepath.mustache
 ├── globals.json
 ├── pages *
 │   └── somepath/
 │   │   └── index.json
 │   │   └── index.mustache
 │   └── index.json
 │   └── index.mustache *
 │   └── 404.json
 │   └── 404.mustache
 └── partials
     └── subfolder/
     │   └── partial1.mustache
     │   └── partial2.mustache
     └── header.mustache
     └── nav.mustache
     └── footer.mustache
```

An * means this is required.

* `layout.mustache` base layout must exist and contain `{{>content}}` for page content
* `layout-somepath.mustache` defines a special layouts for pages in `somepath/`
* `globals.json` is optional and contains global values for mustache variables
* `pages/` contains page templates that are transformed into HTML files
* `pages/*.json` files contain page-specific data, can be also rendered in the layout
* pages can be put into sub-folders. every folder can have a special layout (cf. above)
* `partials/` contains the partial templates that might be used in the page templates
* partials can be structured in sub-folders. include them like: `{{>subfolder/partial1}}`

Please refer to the `test/` folder for a complete example.

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
Due to heavy restructuring and functionality changes this is no regular fork.
