import { Action } from "./Trello";

export interface Setting {
  prefixRecordId?: string;
  excludes?: Array<{
    charactersOrLess?: number;
    match?: string;
  }>;
  isAddDoneTime?: boolean;
  doneListName?: string;
}

export class SettingGuardian {
  public setting: Setting;

  constructor(setting: Setting = {}) {
    this.setting = setting;
  }

  public getPrefixRecordId() {
    return this.setting.prefixRecordId ?? "DEFAULT";
  }

  public isAddDoneTime(listName: string) {
    if (this.setting.isAddDoneTime === undefined || !this.setting.isAddDoneTime)
      return false;

    return listName === (this.setting.doneListName ?? "Done");
  }

  public isSkipEvent(trelloAction: Action) {
    if (this.setting?.excludes === undefined) {
      return false;
    }
    const excludes = this.setting.excludes;

    const isCharacterOrLess = (charactersOrLess: number) => {
      return charactersOrLess >= trelloAction.data.card.name.length;
    };

    const isMatch = (match: string) => {
      return trelloAction.data.card.name.match(match) !== null;
    };

    let isSkip = false;
    for (const excludeSetting of excludes) {
      const checks: boolean[] = [];
      if (excludeSetting.charactersOrLess && trelloAction.data.card) {
        checks.push(
          isCharacterOrLess(excludeSetting.charactersOrLess as number)
        );
      }
      if (excludeSetting.match && trelloAction.data.card) {
        checks.push(isMatch(excludeSetting.match as string));
      }

      if (checks.length === 0) continue;

      if (checks.every((isTrue) => isTrue)) {
        isSkip = true;
        break;
      }
    }
    return isSkip;
  }
}
