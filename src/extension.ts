import * as vscode from 'vscode';
import * as fs from "fs";

/**
 * Get an array of terminal configurations for a given folder.
 */
const getTermsToOpen = (folder: string): vscode.TerminalOptions[] => {
	const { rootPath } = vscode.workspace;
	const config = vscode.workspace.getConfiguration('autoTerm');
	const exclude_folders: string[] = config.get('excludeFolders', []);
	const folder_term_paths: {[folder: string]: string[]} = config.get('folderTermPaths', {});

	if (!rootPath || folder.startsWith('.') || exclude_folders.includes(folder)) {
		return [];
	}

	const base_folder = `${rootPath}/${folder}`;

	// Default config, open 1 terminal at the root of the folder.
	if (!folder_term_paths.hasOwnProperty(folder)) {
		return [{
			name: folder,
			cwd: base_folder
		}];
	}

	return folder_term_paths[folder].map((subfolder_path: string) => ({
		name: subfolder_path.split('/').pop(),
		cwd: `${base_folder}/${subfolder_path}`
	}));
};

/**
 * Open all the terminal tabs for the current workspace.
 */
const openTerminals = async () => {
	const { rootPath } = vscode.workspace;

	if (!rootPath) {
		return;
	}

	const workspace_folders = await fs.promises.readdir(rootPath);

	workspace_folders.forEach(folder => {
		const terms_to_open = getTermsToOpen(folder);
		terms_to_open.forEach(vscode.window.createTerminal);
	});
};

export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('extension.autoTerm', openTerminals);
	context.subscriptions.push(disposable);
}

export function deactivate() {}
