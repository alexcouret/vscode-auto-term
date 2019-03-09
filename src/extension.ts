import * as vscode from 'vscode';
import * as fs from "fs";

const getTermsToOpen = (folder: string): vscode.TerminalOptions[] => {
	const { rootPath } = vscode.workspace;
	const config = vscode.workspace.getConfiguration('autoTerm');
	const exclude_folders: string[] = config.get('excludeFolders', []);
	const folder_term_paths: {[folder: string]: string[]} = config.get('folderTermPaths', {});

	if (!rootPath || folder.startsWith('.') || exclude_folders.includes(folder)) {
		return [];
	}

	const base_folder = `${rootPath}/${folder}`;

	// Default config, open a terminal at the root of the folder.
	if (!folder_term_paths.hasOwnProperty(folder)) {
		return [{
			name: folder,
			cwd: base_folder
		}];
	}

	let folder_map = folder_term_paths[folder];
	if (!Array.isArray(folder_map)) {
		folder_map = [folder_map];
	}

	return folder_term_paths[folder].map((subfolder_path: string) => ({
		name: subfolder_path.split('/').pop(),
		cwd: `${base_folder}/${subfolder_path}`
	}));
};

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

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('extension.autoTerm', openTerminals);
	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
