import * as vscode from "vscode";

import type { Config, ExcludeFolders, FolderTermPaths } from "./types/config";

export const getUserConfig = (): Config => {
  const config = vscode.workspace.getConfiguration("autoTerm");
  const excludeFolders: ExcludeFolders = config.get("excludeFolders", []);
  const folderTermPaths: FolderTermPaths = config.get("folderTermPaths", {});
  const cleanOtherTerms: boolean = config.get("cleanOtherTerms", false);
  const watchWorkspaceChanges: boolean = config.get(
    "watchWorkspaceChanges",
    true,
  );

  return {
    excludeFolders,
    folderTermPaths,
    cleanOtherTerms,
    watchWorkspaceChanges,
  };
};

/**
 * Get an array of terminal configurations for a given folder.
 */
export const getTermsToOpen = (
  folderUri: vscode.Uri,
  userConfig: Config,
): vscode.TerminalOptions[] => {
  const { fsPath: folderPath } = folderUri;
  const folderName = folderPath.split("/").pop() as string;
  const { excludeFolders, folderTermPaths } = userConfig;
  const openTerms = vscode.window.terminals.map(({ name }) => name);

  if (folderName.startsWith(".") || excludeFolders.includes(folderName)) {
    return [];
  }

  // Default config, open 1 terminal at the root of the folder.
  if (!folderTermPaths.hasOwnProperty(folderName)) {
    return openTerms.includes(folderName)
      ? []
      : [
          {
            name: folderName,
            cwd: folderPath,
          },
        ];
  }

  return folderTermPaths[folderName]
    .map((subfolderPath: string) => ({
      name: subfolderPath.split("/").pop(),
      cwd: `${folderPath}/${subfolderPath}`,
    }))
    .filter(({ name }) => !openTerms.includes(name as string));
};

export const getWorkspaceFolderUris = (): vscode.Uri[] => {
  const { workspaceFolders = [] } = vscode.workspace;

  return workspaceFolders.map(({ uri }) => uri);
};
