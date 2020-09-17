/* eslint-disable no-loop-func */
import { Trekin } from "../Trekin";
import path from "path";
import { Action } from "../Trello";
import fs from "fs";

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
  return t;
};

describe("readSettingのテスト", () => {
  const testcases = [
    {
      name: "ワーキングディレクトリにある.trekinrc.json5を読み込める",
      input: undefined,
      expected: {
        exclude: [
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
        "./src/__tests__/trekin_settings/.trekinrc.json5",
        "./src/__tests__/trello_events/skipCreateCard_1.json",
      ],
      expected: "Skip this event",
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
