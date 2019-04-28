type ExcludeFolders = string[];
type FolderTermPaths = { [folder: string]: string[] };

interface Config {
  exclude_folders: ExcludeFolders;
  folder_term_paths: FolderTermPaths;
  clean_other_terms: boolean;
}
