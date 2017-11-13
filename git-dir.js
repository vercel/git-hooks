const path = require('path');

function getPathDir() {
	if (process.env.INIT_CWD) {
		return process.env.INIT_CWD;
	}

	const thisPkgName = require(path.join(__dirname, 'package.json')).name;
	const pkgNamePath = path.join('node_modules', path.format(path.posix.parse(thisPkgName)));
	const paths = process.env.PATH
		.split(path.delimiter)
		.filter(p => p.toLowerCase().indexOf(pkgNamePath) !== -1);

	if (paths.length === 0) {
		// Last-ditch attempt...
		return process.cwd();
	}

	return paths[0];
}

function detectGitDir() {
	let cur = getPathDir();
	let lastCur;
	let lastFound = cur;

	do {
		lastCur = cur;

		if (path.basename(cur) === 'node_modules') {
			lastFound = path.dirname(cur);
		}

		cur = path.dirname(cur);
	} while (cur !== lastCur);

	return path.join(lastFound, '.git');
}

module.exports = detectGitDir;
