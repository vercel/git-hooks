const fs = require('fs');
const path = require('path');

const detectGitDir = require('./git-dir');

// Hard to catch this output if there's no new-line after the script runs.
process.on('exit', () => console.log());

function env(name) {
	if (!process.env[name]) {
		throw new Error(`Required environment variable is empty or not defined - are you using an NPM-compatible package manager?: ${name}`);
	}

	return process.env[name];
}

const nodeBin = env('npm_node_execpath');
const packageManagerBin = env('npm_execpath');

const gitDir = detectGitDir();

if (!gitDir || !fs.existsSync(gitDir) || !fs.statSync(gitDir).isDirectory()) {
	console.error('△  @zeit/git-hooks: .git/hooks directory not found or is not a directory; ignoring Git hook uninstallation:', gitDir || 'reached filesystem boundary (root or drive)');
	process.exit(0);
}

const hooksDir = path.join(gitDir, 'hooks');

// Uninstall each of the hooks
function uninstallHook(name) {
	const hookPath = path.join(hooksDir, name);

	if (!fs.existsSync(hookPath)) {
		return;
	}

	const isOneOfOurs = fs.lstatSync(hookPath).isSymbolicLink() && fs.readlinkSync(hookPath).match(/\.\/_do_hook(\.cjs)?/);

	if (!isOneOfOurs) {
		console.error(`△  @zeit/git-hooks: hook '${name}' appears to be a user hook; skipping: ${hookPath}`);
		return;
	}

	fs.unlinkSync(hookPath);
}

[
	'applypatch-msg',
	'pre-applypatch',
	'post-applypatch',
	'pre-commit',
	'prepare-commit-msg',
	'commit-msg',
	'post-commit',
	'pre-rebase',
	'post-checkout',
	'post-merge',
	'pre-push',
	'pre-receive',
	'update',
	'post-receive',
	'post-update',
	'push-to-checkout',
	'pre-auto-gc',
	'post-rewrite',
	'rebase',
	'sendemail-validate'
].forEach(uninstallHook);

function removeIfExists(path) {
	if (fs.existsSync(path)) {
		fs.unlinkSync(path);
	}
}

removeIfExists(path.join(hooksDir, '_do_hook.cjs'));
removeIfExists(path.join(hooksDir, '_detect_package_hooks.cjs'));
// XXX The following are legacy paths that should also be removed
// XXX if they are found. This will help migration to the new commonjs
// XXX extenions. See https://github.com/vercel/git-hooks/pull/7.
// XXX These checks will most likely be removed at a later date.
removeIfExists(path.join(hooksDir, '_do_hook'));
removeIfExists(path.join(hooksDir, '_detect_package_hooks'));

console.error('△  @zeit/git-hooks: hooks uninstalled successfully');
