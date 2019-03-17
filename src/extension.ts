import * as vscode from 'vscode';
import * as fs from 'fs';

import { getTermsToOpen, getWorkspaceFolderUris } from "./utils";

/**
 * Open all the terminal tabs for the current workspace.
 */
const openTerminals = () => {
	const workspace_folder_uris = getWorkspaceFolderUris();

	if (!workspace_folder_uris.length) {
		return;
	}

	workspace_folder_uris.forEach((folder_uri) => {
		const terms_to_open = getTermsToOpen(folder_uri);
		terms_to_open.forEach(vscode.window.createTerminal);
	});
};

export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('extension.autoTerm', openTerminals);

	context.subscriptions.push(disposable);
	openTerminals();
}

export function deactivate() {}
