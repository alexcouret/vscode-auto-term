# auto-term README

Automatically open terminal tabs based on open files.
This is useful when working with a multi-folder workspace.
It makes it faster to run shell commands without having to leave VSCode, or open manually tabs in the terminal.

## Features

- Automatically open integrated terminal tab(s) for each folder within your multi-root workspace.

## Extension Settings

This extension contributes the following settings:

- `autoTerm.folderTermPaths`:
  Specify a list of subfolders for each of your folders to open tabs at specific paths.
  For instance, if you have a `repo` folder containing two subfolders `sub1` and `sub2` in your workspace, you can have you config setup like this to open 1 tab per subfolder:

  ```
   "autoTerm.folderTermPaths": {
    "repo": [
      "sub1",
      "sub2"
    ]
  ```

- `autoTerm.excludeFolders`: List of folder names to exclude. (By default, only folders starting with `.` are excluded)
  Example:

  ```
    "autoTerm.excludeFolders": ['folder-to-exclude']
  ```

- `autoTerm.cleanOtherTerms`: Clean all terminals not opened by Auto Term. (`false` by default)

```
  "autoTerm.cleanOtherTerms": true
```
