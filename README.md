# Static Base


## Flow

1. Parse 'data' directory (yaml + markdown) -> into js object
2. Copy images & fonts (static assets)
3. SCSS -> include bourbon -> Sass compile/concat
4. Javascript -> 6to5ify -> Concat
5. Add templates and data directly to the main javascript file
6. Compile html files



## Javascript

Features:

- ES6 compiled to ES5 using 6to5ify
- Handlebars v2 `window.Handlebars`
- Handlebars helpers are available via `window.HandlebarsHelpers`
- Handlebars templates are available via `window.app_variable_name.templates` (see settings.yml)
- Data is available as json in script tag



## Development

```bash
# build & watch
gulp

# static server
# -> npm install -g node-static
static build/
```
