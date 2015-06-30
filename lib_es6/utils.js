import colors from "colors";
import fs from "fs";
import matter from "gray-matter";
import toml from "toml";
import traverse from "traverse";


export const DEFAULT_ENCODING = "utf-8";


/// {Parsing}
/// Parse TOML
///
export function parse_toml_file(file_path: string) {
  let obj;

  try {
    obj = toml.parse(fs.readFileSync(file_path));
  } catch (e) {
    console.error(`TOML parsing error in '${file_path}' on line ${e.line}: ${e.message}.`);
  }

  return obj;
}


export function parse_toml(contents: string) {
  return toml.parse(contents);
}


/// Parse Markdown
///
export function parse_markdown_file(parser, file_path: string, front_matter_use_toml=false) {
  let file_contents_as_string = fs.readFileSync(file_path, { encoding: DEFAULT_ENCODING });
  let result;

  try {
    result = parse_markdown(parser, file_contents_as_string, front_matter_use_toml);
  } catch (e) {
    console.error(`Markdown parsing error in '${file_path}': ${e.message}.`);
  }

  return result;
}


export function parse_markdown(parser, contents: string, front_matter_use_toml=false) {
  let front_matter_parser = front_matter_use_toml ? toml.parse : false;
  let front_matter, parsed_markdown, result;

  front_matter = matter(contents, { parser: front_matter_parser });
  parsed_markdown = front_matter ? parser.render(front_matter.content) : null;

  if (parsed_markdown) {
    result = Object.assign({ parsed_markdown: parsed_markdown }, front_matter.data);
    result.title = result.title || extract_title_from_markdown(front_matter.content);

    return result;
  }
}


/// Extract title from markdown
///
export function extract_title_from_markdown(markdown_text: string) {
  let match = markdown_text.match(/^\#{1} ?((\w| |-)+)$/m);
  return match ? match[1] : null;
}


/// {Keys}
/// Path to key
///
export function path_to_key(file_path: string, base_path: string) {
  return file_path
    .replace(base_path, "")
    .replace(/\.\w+$/, "")
    .replace(/^\/+/, "");
}


/// Key to route
///
export function key_to_route(key: string) {
  return key.replace(/\[index\]/g, "").replace(/\/{2,}/, "/");
}


/// Route to path
///
export function route_to_path(route: string) {
  return ((route === "/" ? "" : route) + "/index.html").replace(/^\//, "");
}


/// Clean path
///
export function clean_path(path: string) {
  return path.replace(/(^\.*\/+|\/+$)/, "");
}


/// {Objects}
/// Get value
///
export function obj_get(obj, path) {
  return traverse(obj).get(path.split("/"));
}


export function obj_set(obj, path, value) {
  return traverse(obj).set(path.split("/"), value);
}


export function obj_ensure(obj, path) {
  if (!obj_get(obj, path)) obj_set(obj, path, {});
}


export function obj_traverse(obj, callback, level=1) {
  traverse(obj).forEach(function(x) {
    if (this.level === level) callback(x, this.key);
  });
}


/// {Files}
/// Check if file exists, if not give a warning
///
export function file_exists(path: string, warning=true) {
  try {
    fs.accessSync(path);
    return true;
  } catch (e) {
    if (warning) console.log(colors.yellow(`WARNING: '${path}' was not found`));
    return false;
  }
}
