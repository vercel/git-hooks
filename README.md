# @zeit/git-hooks

No nonsense [Git hook](https://git-scm.com/docs/githooks) management.

![](screenshot.png)

## Usage

Install this module, preferably as a dev-dependency:

```console
yarn add --dev @zeit/git-hooks
```

That's it. You can now use the module in two ways:

```json
{
  "scripts": {
    "git-pre-commit": "eslint"
  }
}
```

The above will run a single command line, just like running `npm run git-pre-commit` or `yarn git-pre-commit`,
every time you `git commit`.

Alternatively, if you'd like to run several scripts in succession upon a hook, you may define a `git` top-level
property and specify an array of scripts to run:

```json
{
  "git": {
    "pre-commit": "lint"
  }
}
```

or

```json
{
  "git": {
    "pre-commit": ["lint", "test"]
  }
}
```

Note that any `"scripts"` hooks supplant any corresponding `"git"` hooks. That is to say, if you define both a
`{"scripts": {"git-pre-commit": "..."}}` hook and a `{"git": {"pre-commit": []}}` hook, the hook in `"scripts"`
will be the only hook that is executed.

# License
Copyright &copy; 2017 by ZEIT, Inc. Released under the [MIT License](LICENSE).
