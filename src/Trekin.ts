import { Action, Certificate } from "./Trello";
import { Worker } from "./Worker";
import { Apps } from "./Kintone";
import path from "path";
import { SettingGuardian } from "./Setting";
const fs = require("fs");
const JSON5 = require("json5");

export class Trekin {
  private kintoneApps: Apps;
  private trelloCert: Certificate;
  private worker: Worker;
  public guardian: SettingGuardian = new SettingGuardian();
  private readonly defaultSettingPath: string;

  constructor(kintoneApps: Apps, trelloCert: Certificate) {
    this.kintoneApps = kintoneApps;
    this.trelloCert = trelloCert;
    this.defaultSettingPath = path.join(process.cwd(), ".trekinrc.json5");
    this.worker = new Worker(kintoneApps, trelloCert);
  }

  public async readSetting(filePath: string | undefined = undefined) {
    this.guardian = new SettingGuardian(
      JSON5.parse(
        fs.readFileSync(
          filePath !== undefined ? filePath : this.defaultSettingPath,
          "utf-8"
        )
      )
    );
  }

  public async operation(
    trelloAction: Action
  ): Promise<
    | string
    | {
        app: string;
        id?: string;
        record: {
          [key: string]: {
            value: string | string[] | Array<{ id: string }> | undefined;
          };
        };
      }
    | {
        app: string;
        comment: { text: string };
      }
    | { [key: string]: { value: string } }
  > {
    if (this.guardian.isSkipEvent(trelloAction)) {
      return Promise.resolve("Skip this event");
    }
    this.worker.trelloAction = trelloAction;
    return this.worker.action();
  }

  public async postOperation(trelloAction: Action) {
    if (this.guardian.isSkipEvent(trelloAction)) {
      return Promise.resolve("Skip this event");
    }
    this.worker.trelloAction = trelloAction;
    return this.worker.postAction();
  }
}
