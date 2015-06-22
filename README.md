# Static Base

A optionated set of tools for building static websites.  
Uses handlebars, markdown and toml.



## How to use

Example structure:

```
content/pages
content/pages/[index].md
content/pages/[index].toml
content/pages/about.md
content/pages/about.toml
content/pages/blog.toml
content/collections/blog/sample-post-1.md
content/collections/blog/sample-post-2.md

templates/pages/[index].hbs
templates/pages/about.hbs
templates/pages/blog.hbs
templates/pages/blog/post.hbs
templates/partials/navigation.hbs

layouts/application.hbs

assets/javascripts/application.js
assets/stylesheets/application.scss
assets/images/...
```

This structure uses the default directory names/paths
and can be used in the following way:

```js
import StaticBase from "static-base";
import path from "path"; // node-js stdlib


// 1st argument, project root
// 2nd argument, options
let instance = new StaticBase(__dirname, {
  content: {
    collections: {

      // parse files from the `content/collections/blog` directory
      blog: function(file_path, item_path, tree, parsers) {
        if (file_path.endsWith(".md")) {
          let key = path.basename(item_path, ".md");
          let parse_result = parsers.parse_markdown_file(file_path);
          if (parse_result.published) tree.handle_data(key, parse_result);
        }
      }

    }
  },

  assets: {
    static_directories: [
      "images"
    ]
  }
});

// make a build
instance.build();

// make a partial build
instance.build("html");
```


### JSPM

The build method also sets up JSPM if it needs to. That is, it checks if there's a jspm property defined in package.json, if there's not, it adds the paths defined in the options object that is passed to the StaticBase constructor.

How to override the default paths:

```js
new StaticBase(__dirname, {
  assets: {
    jspm_config_path: "lib/jspm_config.js",
    jspm_packages_path: "build/assets/jspm_packages"
  }
});
```


### Partial build arguments

- `html`
- `css` or `stylesheets`
- `js` or `javascripts`
- `static_assets`



## Example / Demo

For an example using all possible options, see the `test` directory.



## Collections with assets

Example structure:

```
content/collections/portfolio/item-1/description.md
content/collections/portfolio/item-1/settings.toml
content/collections/portfolio/item-1/image.jpg
```

```js
portfolio: function(file_path, item_path, tree, parsers) {
  // the key represent the item's slug/name/path
  // e.g. 'item-1'
  let key = item_path.split("/")[0];

  if (file_path.endsWith("settings.toml")) {
    tree.handle_data(key, parsers.parse_toml_file(file_path));
  } else if (file_path.endsWith("description.md")) {
    tree.handle_data(key, parsers.parse_markdown_file(file_path));
  } else if (file_path.match(/\.(png|jpg|jpeg|gif|svg|webp)$/i)) {
    // if 2nd argument is given, it is stored in `portfolio_tree.item.assets`
    // if no 2nd argument is given, it is stored in `portfolio_tree.assets`
    tree.handle_asset(item_path, key);
  }
}
```



## Customize directories

Defaults:

```js
new StaticBase(__dirname, {
  content: {
    directory: "content"
  },
  assets: {
    directory: "assets",
    css_directory: "stylesheets",
    js_directory: "javascripts",
    static_directories: [],

    jspm_config_path: "jspm-config.js",
    jspm_packages_path: "lib/jspm_packages",
  },
  build: {
    directory: "build"
  }
});
```



## Markdown and frontmatter

The markdown is compiled through [markdown-it](https://github.com/markdown-it/markdown-it) and the frontmatter (yaml format) through [gray-matter](https://github.com/jonschlinkert/gray-matter).

Example:

```markdown
---
key: "value"
---

# This title will be extracted and put into the __title property__

Text
```

The frontmatter uses the YAML format by default because it is better supported in markdown editors. But you can use the TOML format by setting the following option:

```js
new StaticBase(__dirname, {
  content: {
    frontmatter: {
      use_toml_syntax: true
    }
  }
})
```

To install [markdown-it extensions](https://github.com/markdown-it/markdown-it#syntax-extensions):

```js
import MarkdownItMark from "markdown-it-mark";


instance.markdown_parser.use(MarkdownItMark);
```



## Stylesheets

The CSS is compiled with `node-sass` and `bourbon` can be imported.



## Todo list

- Create a simple JSPM workflow
- Production build option (no sourcemaps, minified js & css)
- More handlebars helpers (better ways to loop over collections & pages)
- Export json object
- Export handlebars templates to javascript
- Initial state and data object in html (optional)
- Add support for multiple languages
- Add support for multiple layouts (html frontmatter)
- Add some basic client-side javascript stuff?
