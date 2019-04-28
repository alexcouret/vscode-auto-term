import * as vscode from "vscode";

import ExtensionManager from "./extension-manager";

export function activate(context: vscode.ExtensionContext) {
  const extensionManager = new ExtensionManager();
  const disposable = vscode.commands.registerCommand(
    "extension.autoTerm",
    extensionManager.run.bind(extensionManager)
  );

  context.subscriptions.push(disposable);
  extensionManager.run();
}

export function deactivate() {}
