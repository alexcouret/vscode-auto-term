import * as vscode from 'vscode';
import * as fs from 'fs';

import { getTermsToOpen } from "./utils";

/**
 * Open all the terminal tabs for the current workspace.
 */
const openTerminals = () => {
	const { rootPath } = vscode.workspace;

	if (!rootPath) {
		return;
	}

	fs.readdir(rootPath, (err, folders) => {
		if (err) {
			return;
		}
		folders.forEach(folder => {
			const terms_to_open = getTermsToOpen(folder);
			terms_to_open.forEach(vscode.window.createTerminal);
		});
	});
};

export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('extension.autoTerm', openTerminals);

	context.subscriptions.push(disposable);
	openTerminals();
}

export function deactivate() {}
