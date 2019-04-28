import * as vscode from "vscode";

const getUserConfig = (): Config => {
  const config = vscode.workspace.getConfiguration("autoTerm");
  const exclude_folders: ExcludeFolders = config.get("excludeFolders", []);
  const folder_term_paths: FolderTermPaths = config.get("folderTermPaths", {});
  const clean_other_terms: boolean = config.get("cleanOtherTerms", false);

  return {
    exclude_folders,
    folder_term_paths,
    clean_other_terms
  };
};

/**
 * Get an array of terminal configurations for a given folder.
 */
const getTermsToOpen = (
  folder_uri: vscode.Uri,
  user_config: Config
): vscode.TerminalOptions[] => {
  const { fsPath: folder_path } = folder_uri;
  const folder_name = folder_path.split("/").pop() as string;
  const { exclude_folders, folder_term_paths } = user_config;
  const open_terms = vscode.window.terminals.map(({ name }) => name);

  if (folder_name.startsWith(".") || exclude_folders.includes(folder_name)) {
    return [];
  }

  // Default config, open 1 terminal at the root of the folder.
  if (!folder_term_paths.hasOwnProperty(folder_name)) {
    return open_terms.includes(folder_name)
      ? []
      : [
          {
            name: folder_name,
            cwd: folder_path
          }
        ];
  }

  return folder_term_paths[folder_name]
    .map((subfolder_path: string) => ({
      name: subfolder_path.split("/").pop(),
      cwd: `${folder_path}/${subfolder_path}`
    }))
    .filter(({ name }) => !open_terms.includes(name as string));
};

const getWorkspaceFolderUris = (): vscode.Uri[] => {
  const { workspaceFolders = [] } = vscode.workspace;

  return workspaceFolders.map(({ uri }) => uri);
};

export { getTermsToOpen, getWorkspaceFolderUris, getUserConfig };
