import { getUserConfig } from "./utils";
import AutoTerm from "./auto-term";

export default class ExtensionManager {
  private autoTerm: AutoTerm;

  constructor() {
    this.autoTerm = new AutoTerm(getUserConfig());
  }

  run() {
    this.autoTerm.open();
    this.autoTerm.clean();
  }
}
