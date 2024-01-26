import * as vscode from "vscode";

import { getWorkspaceFolderUris, getTermsToOpen } from "./utils";
import type { Config } from "./types/config";

export default class AutoTerm {
  private userConfig: Config;
  private openTerms: { term: vscode.Terminal; uri: vscode.Uri }[];

  constructor(userConfig: Config) {
    this.openTerms = [];
    this.userConfig = userConfig;
  }

  open() {
    const workspaceFolderUris = getWorkspaceFolderUris();

    if (!workspaceFolderUris.length) {
      return;
    }

    this.openTermsForFolders(workspaceFolderUris);
  }

  clean() {
    if (!this.userConfig.cleanOtherTerms) {
      return;
    }

    vscode.window.terminals.forEach((terminal: vscode.Terminal) => {
      if (
        !this.openTerms.find(({ term: { name } }) => name === terminal.name)
      ) {
        try {
          terminal.dispose();
        } catch (err) {
          console.error(`Could not dispose terminal '${terminal.name}'.`, err);
        }
      }
    });
  }

  watchWorkspaceChanges() {
    if (this.userConfig.watchWorkspaceChanges) {
      vscode.workspace.onDidChangeWorkspaceFolders(({ added, removed }) => {
        console.debug("Workspace folders changed.", { added, removed });
        if (added.length) {
          this.openTermsForFolders(added.map(({ uri }) => uri));
        }

        if (removed.length) {
          this.closeTermsForFolders(removed.map(({ uri }) => uri));
        }
      });
    }
  }

  private openTermsForFolders(folderURIs: vscode.Uri[]) {
    folderURIs.forEach((folderUri) => {
      const termsToOpen = getTermsToOpen(folderUri, this.userConfig);
      termsToOpen.forEach((terminal: vscode.TerminalOptions) => {
        try {
          console.debug(
            `Opening terminal '${terminal.name}' for URI '${folderUri}'.`,
          );
          this.openTerms.push({
            term: vscode.window.createTerminal(terminal),
            uri: folderUri,
          });
        } catch (err) {
          console.error(`Could not open terminal '${terminal.name}'.`, err);
        }
      });
    });
  }

  private closeTermsForFolders(folderURIs: vscode.Uri[]) {
    this.openTerms.forEach(({ term, uri }) => {
      if (folderURIs.find((folderUri) => folderUri.path === uri.path)) {
        try {
          console.debug(`Closing terminal '${term.name}' for URI '${uri}'.`);
          term.dispose();
        } catch (err) {
          console.error(`Could not dispose terminal '${term.name}'.`, err);
        }
      }
    });
  }
}
