import glob from 'glob';


/**
 * Makes a list of all the files that match the given glob pattern.
 * @param {string} pattern
 * @param {Dependencies} deps
 * @return {string[]} List of file paths relative from deps.wd (paths)
 */
export default function(pattern, deps) {
  return new Promise((resolve, reject) => {
    glob(pattern, { cwd: deps.root }, (err, matches) => {
      if (err) return reject(err);

      const matchesWithoutWorkDirectory = matches.map((p) => {
        return p.replace(new RegExp(`^\/?${deps.wd}\/?`), '');
      });

      resolve(matchesWithoutWorkDirectory);
    });
  });
}
