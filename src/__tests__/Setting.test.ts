/* eslint-disable no-loop-func */
import { Trekin } from "../Trekin";
import { Action, ListShort } from "../Trello";
import fs from "fs";
import { Worker } from "../Worker";

jest.mock("../Worker");
const WorkerMock = (Worker as unknown) as jest.Mock;

const createTrekin = () => {
  const t = new Trekin(
    {
      baseUrl: "",
      cards: { id: "", token: "" },
      defaultKintoneUserCode: "",
      labels: { id: "", token: "" },
      lists: { id: "", token: "" },
      members: { id: "", token: "" },
    },
    { apiKey: "", apiToken: "" }
  );
  WorkerMock.mockImplementation(() => {
    return {
      trelloAction: undefined,
      action: () => {
        return Promise.resolve("Not skip this event");
      },
    };
  });

  return t;
};

describe("readSettingのテスト", () => {
  const testcases = [
    {
      name: "ワーキングディレクトリにある.trekinrc.json5を読み込める",
      input: undefined,
      expected: {
        excludes: [
          {
            charactersOrLess: 12,
          },
        ],
      },
    },
  ];

  for (const { name, input, expected } of testcases) {
    test(name, async () => {
      const t = await createTrekin();
      await t.readSetting(input);
      expect(t.guardian.setting).toEqual(expected);
    });
  }
});

describe("skipのテスト", () => {
  const testcases = [
    {
      name: "12文字以内はskipできる",
      input: [
        "./src/__tests__/trekin_settings/charactersOrLess_only.trekinrc.json5",
        "./src/__tests__/trello_events/skipCreateCard_1.json",
      ],
      expected: "Skip this event",
    },
    {
      name: "「↑2020/08/20」はskipできる",
      input: [
        "./src/__tests__/trekin_settings/match_only_1.trekinrc.json5",
        "./src/__tests__/trello_events/skipCreateCard_1.json",
      ],
      expected: "Skip this event",
    },
    {
      name: "「\\d{4}\\/\\d{2}\\/\\d{2}」はskipできる",
      input: [
        "./src/__tests__/trekin_settings/match_only_2.trekinrc.json5",
        "./src/__tests__/trello_events/skipCreateCard_1.json",
      ],
      expected: "Skip this event",
    },
    {
      name: "「12文字以内」かつ「\\d{4}\\/\\d{2}\\/\\d{2}」はskipできる",
      input: [
        "./src/__tests__/trekin_settings/multiple_rule_1.trekinrc.json5",
        "./src/__tests__/trello_events/skipCreateCard_1.json",
      ],
      expected: "Skip this event",
    },
    {
      name:
        "「\\d{4}\\/\\d{2}\\/\\d{2}」にはマッチするが「12文字以内」にマッチしないのでskipしない",
      input: [
        "./src/__tests__/trekin_settings/multiple_rule_1.trekinrc.json5",
        "./src/__tests__/trello_events/skipCreateCard_2.json",
      ],
      expected: "Not skip this event",
    },
    {
      name:
        "「12文字以内」にはマッチするが「\\d{4}\\/\\d{2}\\/\\d{2}」にマッチしないのでskipしない",
      input: [
        "./src/__tests__/trekin_settings/multiple_rule_1.trekinrc.json5",
        "./src/__tests__/trello_events/skipCreateCard_3.json",
      ],
      expected: "Not skip this event",
    },
    {
      name:
        "1つめのルールにはマッチしないが2つめのルールにマッチするのでskipする",
      input: [
        "./src/__tests__/trekin_settings/multiple_rule_2.trekinrc.json5",
        "./src/__tests__/trello_events/skipCreateCard_1.json",
      ],
      expected: "Skip this event",
    },
    {
      name: "どのルールにもにマッチしないのでskipする",
      input: [
        "./src/__tests__/trekin_settings/multiple_rule_2.trekinrc.json5",
        "./src/__tests__/trello_events/createCard_1.json",
      ],
      expected: "Not skip this event",
    },
  ];

  for (const { name, input, expected } of testcases) {
    test(name, async () => {
      const t = await createTrekin();
      await t.readSetting(input[0]);
      const action: Action = JSON.parse(await fs.readFileSync(input[1], "utf8"))
        .body.action;
      const actual = await t.operation(action);
      expect(actual).toEqual(expected);
    });
  }
});

describe("addDoneTimeのテスト", () => {
  const testcases = [
    {
      name:
        "カスタムdone名とアフターリスト名が一致するのでAddDoneTime()でtrueを返す",
      input: [
        "./src/__tests__/trekin_settings/enableAddDoneTime_1.trekinrc.json5",
        "./src/__tests__/trello_events/updateCard_idList_3.json",
      ],
      expected: true,
    },
    {
      name:
        "カスタムdone名とアフターリスト名が一致しないのでAddDoneTime()でfalseを返す",
      input: [
        "./src/__tests__/trekin_settings/enableAddDoneTime_1.trekinrc.json5",
        "./src/__tests__/trello_events/updateCard_idList_2.json",
      ],
      expected: false,
    },
    {
      name:
        "デフォルトdone名とアフターリスト名が一致するのでAddDoneTime()でtrueを返す",
      input: [
        "./src/__tests__/trekin_settings/enableAddDoneTime_2.trekinrc.json5",
        "./src/__tests__/trello_events/updateCard_idList_4.json",
      ],
      expected: true,
    },
    {
      name:
        "デフォルトdone名とアフターリスト名が一致しないのでAddDoneTime()でfalseを返す",
      input: [
        "./src/__tests__/trekin_settings/enableAddDoneTime_2.trekinrc.json5",
        "./src/__tests__/trello_events/updateCard_idList_2.json",
      ],
      expected: false,
    },
    {
      name: "isAddDoneTimeがfalseなのでAddDoneTime()でfalseを返す",
      input: [
        "./src/__tests__/trekin_settings/.trekinrc.json5",
        "./src/__tests__/trello_events/updateCard_idList_4.json",
      ],
      expected: false,
    },
  ];

  for (const { name, input, expected } of testcases) {
    test(name, async () => {
      const t = await createTrekin();
      await t.readSetting(input[0]);
      const action: Action = JSON.parse(await fs.readFileSync(input[1], "utf8"))
        .body.action;
      const actual = t.guardian.isAddDoneTime(
        (action.data.listAfter as ListShort).name
      );
      expect(actual).toEqual(expected);
    });
  }
});

describe("getPrefixRecordIdのテスト", () => {
  const testcases = [
    {
      name: "設定しているprefixRecordIdを返す",
      input: ["./src/__tests__/trekin_settings/prefixRecordId.trekinrc.json5"],
      expected: "TEST",
    },
    {
      name: "未設定の場合はDEFAULTを返す",
      input: [
        "./src/__tests__/trekin_settings/enableAddDoneTime_1.trekinrc.json5",
      ],
      expected: "DEFAULT",
    },
  ];

  for (const { name, input, expected } of testcases) {
    test(name, async () => {
      const t = await createTrekin();
      await t.readSetting(input[0]);
      const actual = t.guardian.getPrefixRecordId();
      expect(actual).toEqual(expected);
    });
  }
});
