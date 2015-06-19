import { exec } from "child_process";


function build_command(static_base) {
  let build_path = static_base.paths.build;

  let cmd = [
    `find ${build_path}`
  ];

  let ignore = [
    `${build_path}/${static_base.directories.assets}/jspm_packages`,
    `${build_path}/${static_base.directories.assets}$`,
    `${build_path}$`
  ];

  cmd = cmd.concat(
    ignore.map(function(i) {
      return `grep -v "${i}"`;
    })
  );

  cmd.push("xargs rm -rf");
  return cmd.join(` | `);
}


export default function(static_base) {
  console.log("> Clean");
  exec(build_command(static_base));
}
