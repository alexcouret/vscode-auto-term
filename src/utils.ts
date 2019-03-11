import * as vscode from 'vscode';

const _getAlreadyOpenedTerms = (): Set<string> => {
  return new Set(vscode.window.terminals.map(({ name }) => name));
};

const _getConfig = (): Config => {
  const config = vscode.workspace.getConfiguration('autoTerm');
  const exclude_folders: ExcludeFolders = config.get('excludeFolders', []);
  const folder_term_paths: FolderTermPaths = config.get('folderTermPaths', {});

  return {
    exclude_folders,
    folder_term_paths
  };
};

/**
 * Get an array of terminal configurations for a given folder.
 */
const getTermsToOpen = (folder: string): vscode.TerminalOptions[] => {
  const { rootPath } = vscode.workspace;
  const { exclude_folders, folder_term_paths } = _getConfig();
  const open_terms = _getAlreadyOpenedTerms();

  if (!rootPath || folder.startsWith('.') || exclude_folders.includes(folder)) {
    return [];
  }

  const folder_path = `${rootPath}/${folder}`;

  // Default config, open 1 terminal at the root of the folder.
  if (!folder_term_paths.hasOwnProperty(folder)) {
    return open_terms.has(folder)
      ? []
      : [{
        name: folder,
        cwd: folder_path,
      }];
  }

  return folder_term_paths[folder]
    .map((subfolder_path: string) => ({
      name: subfolder_path.split('/').pop(),
      cwd: `${folder_path}/${subfolder_path}`,
    }))
    .filter(({ name }) => !open_terms.has(name as string));
};

export { getTermsToOpen };
