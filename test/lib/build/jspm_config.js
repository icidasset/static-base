System.config({
  "baseURL": "/",
  "defaultJSExtensions": true,
  "transpiler": "traceur",
  "paths": {
    "github:*": "build/assets/jspm_packages/github/*"
  }
});

System.config({
  "map": {
    "traceur": "github:jmcriffey/bower-traceur@0.0.90",
    "traceur-runtime": "github:jmcriffey/bower-traceur-runtime@0.0.90"
  }
});

