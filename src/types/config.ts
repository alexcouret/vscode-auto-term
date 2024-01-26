export type ExcludeFolders = string[];
export type FolderTermPaths = { [folder: string]: string[] };

export interface Config {
  excludeFolders: ExcludeFolders;
  folderTermPaths: FolderTermPaths;
  cleanOtherTerms: boolean;
  watchWorkspaceChanges: boolean;
}
