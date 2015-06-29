import chokidar from "chokidar";
import colors from "colors";


const IGNORED = [
  /^\.git/,
  /^node_modules/,
  /^build/,
  /jspm_config\.js$/,
  /(^|\/)\.(\w|-)+/,
  "package.json"
];


function watch_handler(event, path) {
  if (path.endsWith(".scss")) {
    this.build("stylesheets");

  } else if (path.endsWith(".js")) {
    if (path.match(/^lib\//)) {
      console.log(colors.yellow("{!} Restart the watch command."));
    } else {
      this.build("javascripts");
    }

  } else if (path.endsWith(".hbs")) {
    this.make_trees();
    this.build("html");
    this.build("javascripts");

  } else if (path.match(/^content\//)) {
    this.make_trees();
    this.build("html");
    this.build("json");
    this.build("static_assets");

  } else if (path.match(/^assets\//)) {
    this.build("static_assets");

  }

  console.log(colors.bold(`'${path}' changed`));
}


export default function(static_base, options={}) {
  console.log("> Watch");

  chokidar
    .watch(".", { ignored: IGNORED, ignoreInitial: true })
    .on("all", watch_handler.bind(static_base));
}
