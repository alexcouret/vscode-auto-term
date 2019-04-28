import * as vscode from "vscode";

import { getWorkspaceFolderUris, getTermsToOpen } from "./utils";

export default class AutoTerm {
  private user_config: Config;
  private open_terms: vscode.Terminal[];

  constructor(user_config: Config) {
    this.open_terms = [];
    this.user_config = user_config;
  }

  open() {
    const workspace_folder_uris = getWorkspaceFolderUris();

    if (!workspace_folder_uris.length) {
      return;
    }

    workspace_folder_uris.forEach(folder_uri => {
      const terms_to_open = getTermsToOpen(folder_uri, this.user_config);
      terms_to_open.forEach((terminal: vscode.TerminalOptions) => {
        try {
          this.open_terms.push(vscode.window.createTerminal(terminal));
        } catch (err) {
          console.error(`Could not open terminal '${terminal.name}'.`, err);
        }
      });
    });
  }

  clean() {
    if (!this.user_config.clean_other_terms) {
      return;
    }

    vscode.window.terminals.forEach((terminal: vscode.Terminal) => {
      if (!this.open_terms.find(({ name }) => name === terminal.name)) {
        try {
          terminal.dispose();
        } catch (err) {
          console.error(`Could not dispose terminal '${terminal.name}'.`, err);
        }
      }
    });
  }
}
