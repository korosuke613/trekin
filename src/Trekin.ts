import { Action } from "./Trello";
import { Worker } from "./Worker";
import { Apps } from "./Kintone";

export class Trekin {
  public kintoneApps: Apps;
  private worker: Worker;

  constructor(kintoneApps: Apps) {
    this.kintoneApps = kintoneApps;
    this.worker = new Worker(kintoneApps);
  }

  public async operationKintone(trelloAction: Action) {
    return this.worker.action(trelloAction);
  }
}
