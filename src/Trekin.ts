import { Action, Certificate } from "./Trello";
import { Worker } from "./Worker";
import { Apps } from "./Kintone";
import path from "path";
const fs = require("fs");
const JSON5 = require("json5");

interface Setting {
  exclude?: Array<{
    charactersOrLess?: number;
  }>;
}

class SettingGuardian {
  public setting: Setting | undefined;

  constructor(setting: Setting = {}) {
    this.setting = setting;
  }

  public isSkipEvent(trelloAction: Action) {
    let isSkip = false;
    if (this.setting?.exclude === undefined) {
      return false;
    }
    const excludes = this.setting?.exclude;

    for (const excludeSetting of excludes) {
      if (
        excludeSetting.charactersOrLess &&
        trelloAction.data.card &&
        excludeSetting.charactersOrLess >= trelloAction.data.card.name.length
      ) {
        isSkip = true;
        break;
      }
    }
    return isSkip;
  }
}

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
    if (filePath === undefined) {
      filePath = this.defaultSettingPath;
    }
    this.guardian = new SettingGuardian(
      JSON5.parse(fs.readFileSync(filePath, "utf-8"))
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
    if (this.guardian.isSkipEvent(trelloAction))
      return Promise.resolve("Skip this event");
    this.worker.trelloAction = trelloAction;
    return this.worker.action();
  }

  public async postOperation(trelloAction: Action) {
    this.worker.trelloAction = trelloAction;
    return this.worker.postAction();
  }
}
