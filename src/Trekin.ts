import { Action, Certificate } from "./Trello";
import { Worker } from "./Worker";
import { Apps } from "./Kintone";

export class Trekin {
  private kintoneApps: Apps;
  private trelloCert: Certificate;
  private worker: Worker;

  constructor(kintoneApps: Apps, trelloCert: Certificate) {
    this.kintoneApps = kintoneApps;
    this.trelloCert = trelloCert;
    this.worker = new Worker(kintoneApps, trelloCert);
  }

  public async operation(trelloAction: Action) {
    this.worker.trelloAction = trelloAction;
    return this.worker.action();
  }

  public async postOperation(trelloAction: Action) {
    this.worker.trelloAction = trelloAction;
    return this.worker.postAction();
  }
}
