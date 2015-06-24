import { execSync } from "child_process";


function build_command(static_base, hard=false) {
  let build_path = static_base.paths.build;

  let cmd = [
    `find ${build_path}`
  ];

  let ignore = [
    `${build_path}$`
  ].concat(hard ? [] : [
    `${build_path}/${static_base.directories.assets}/${static_base.directories.assets_js}`,
    `${build_path}/${static_base.directories.assets}$`,

    `${static_base.options.assets.jspm_packages_path}`
  ]);

  cmd = cmd.concat(
    ignore.map(function(i) {
      return `grep -v "${i}"`;
    })
  );

  cmd.push("xargs rm -rf");
  return cmd.join(` | `);
}


export default function(static_base, options={}) {
  console.log("> Clean");
  execSync(build_command(static_base, options.hard));
}
