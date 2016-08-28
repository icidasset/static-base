import { cleanPath } from './utils';
import glob from 'glob';


/**
 * Makes a list of all the files that match the given glob pattern.
 * @param {string} pattern
 * @param {Dependencies} deps
 * @return {string[]} List of file paths relative from deps.wd (paths)
 */
export default function list(pattern, deps) {
  return new Promise((resolve, reject) => {
    glob(pattern, { cwd: deps.root }, (err, matches) => {
      if (err) return reject(err);

      const matchesWithoutWorkDirectory = matches.map(path => {
        const regex = new RegExp(`^${deps.wd}\/+`);
        return cleanPath(path, { beginning: true }).replace(regex, '');
      });

      resolve(matchesWithoutWorkDirectory);
    });
  });
}
