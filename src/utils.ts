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
const getTermsToOpen = (folder_uri: vscode.Uri): vscode.TerminalOptions[] => {
  const {
    fsPath: folder_path
  } = folder_uri;
  const folder_name = folder_path.split('/').pop() as string;
  const { exclude_folders, folder_term_paths } = _getConfig();
  const open_terms = _getAlreadyOpenedTerms();

  if (folder_name.startsWith('.') || exclude_folders.includes(folder_name)) {
    return [];
  }

  // Default config, open 1 terminal at the root of the folder.
  if (!folder_term_paths.hasOwnProperty(folder_name)) {
    return open_terms.has(folder_name)
      ? []
      : [{
        name: folder_name,
        cwd: folder_path,
      }];
  }

  return folder_term_paths[folder_name]
    .map((subfolder_path: string) => ({
      name: subfolder_path.split('/').pop(),
      cwd: `${folder_path}/${subfolder_path}`,
    }))
    .filter(({ name }) => !open_terms.has(name as string));
};

const getWorkspaceFolderUris = (): vscode.Uri[] => {
  const { workspaceFolders = [] } = vscode.workspace;

  return workspaceFolders.map(({ uri }) => uri);
};

export { getTermsToOpen, getWorkspaceFolderUris };
