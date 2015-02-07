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



## TODO

- data.json file for every locale
