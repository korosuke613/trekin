import { Action } from "./Trello";

export interface Setting {
  exclude?: Array<{
    charactersOrLess?: number;
    match?: string;
  }>;
}

export class SettingGuardian {
  public setting: Setting | undefined;

  constructor(setting: Setting = {}) {
    this.setting = setting;
  }

  public isSkipEvent(trelloAction: Action) {
    if (this.setting?.exclude === undefined) {
      return false;
    }
    const excludes = this.setting?.exclude;

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
