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
content/collections/blog/sample-post.md

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
import * as static_base from "static-base";


// first argument, project root
let instance = new static_base.Class(__dirname, {
  content: {
    collections: {

      blog: function(file_path, item_path, tree) {
        if (file_path.endsWith(".md")) {
          let key = item_path.split("/")[0];
          let parse_result = static_base.utils.parse_markdown_file(file_path);
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


### Partial build arguments

- `html`
- `css` or `stylesheets`
- `js` or `javascripts`
- `static_assets`



## Example / Demo

TODO



## Collection with assets

Example structure:

```
content/collections/portfolio/description.md
content/collections/portfolio/settings.toml
content/collections/portfolio/image.jpg
```

```js
portfolio: function(file_path, item_path, tree) {
  // the key represent the item's slug/name/path
  let key = item_path.split("/")[0];

  if (file_path.endsWith("settings.toml")) {
    tree.handle_data(key, static_base.utils.parse_toml_file(file_path));
  } else if (file_path.endsWith("description.md")) {
    tree.handle_data(key, static_base.utils.parse_markdown_file(file_path));
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
new static_base.Class(__dirname, {
  content: {
    directory: "content",
  },
  assets: {
    directory: "assets",
    css_directory: "stylesheets",
    js_directory: "javascripts",
    static_directories: []
  },
  build: {
    directory: "build"
  }
});
```



## Markdown and frontmatter

The markdown is compiled through [markdown-it](https://github.com/markdown-it/markdown-it) and the frontmatter (toml format) through [gray-matter](https://github.com/jonschlinkert/gray-matter).

Example:

```markdown
---
key = "value"
---

# This title will be extracted and put into the __title property__

Text
```

To install [markdown-it extensions](https://github.com/markdown-it/markdown-it#syntax-extensions):

```js
import MarkdownItMark from "markdown-it-mark";


instance.markdown_parser.use(MarkdownItMark);
```



## Stylesheets

The CSS is compiled with `node-sass` and `bourbon` can be imported.



## Todo list

- Make example
- Write tests
- Production build option (no sourcemaps, minified js & css)
- More handlebars helpers (better ways to loop over collections & pages)
