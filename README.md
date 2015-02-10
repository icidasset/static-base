# Static Base

A scaffolding for static websites, focused on sites using the history api.


## Features

### General

- Data, in multiple languages, through yaml and markdown files
- Templates, written in handlebars, compiled to html and javascript
- Templates use layouts and partials


### Javascript

- ES6 compiled to ES5 using 6to5ify
- Handlebars v2 `window.Handlebars`
- Handlebars helpers are available via `window.HandlebarsHelpers`
- Handlebars templates are available via `window.app_variable_name.templates` (see config.yml)
- Data is available as JSON in script tag or separate file



## Development

```bash
# build & watch
gulp

# static server
# -> npm install -g node-static
static build/
```



## How it works

### Routing

The tree structure of `data/:locale/pages` is converted into a routing table that will be used to build the html files and is also used to setup the routing in javascript. For example, `about/origin.yml` will have the route `about/origin/`. This can be overridden by adding a __route property__ in the yaml, the __fr__ locale serves as an example for this. A routing table is build for every locale and is stored in its data object as `_routing_table`. _PS. The file and directory names should be the same for every locale and should also match the tree structure for the templates_.

The base of the routes is calculated based on the __initial route__, which is passed to javascript by the `initial-state` JSON object. The JSON is located in the application layout.
