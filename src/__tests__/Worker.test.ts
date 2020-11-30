/* eslint-disable no-loop-func */
import { Trekin } from "../Trekin";
import { Action } from "../Trello";
import fs from "fs";
import { Worker } from "../Worker";
import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import { SettingGuardian } from "../Setting";
import { ApiExecutor } from "../ApiExecutor";
const JSON5 = require("json5");

jest.mock("@kintone/rest-api-client");
const KintoneMock = (KintoneRestAPIClient as unknown) as jest.Mock;

jest.mock("../ApiExecutor");
const getRecordIdFromCardMock = (ApiExecutor.getRecordIdFromCard as unknown) as jest.Mock;
const addTimeOfDoneToRecordMock = (ApiExecutor.addTimeOfDoneToRecord as unknown) as jest.Mock;

const createWorker = () => {
  const w = new Worker(
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

  return w;
};

describe("addTimeOfDoneToRecordのテスト", () => {
  const testcases = [
    {
      name: "変更日時を取得できる",
      input: {
        actionPath: "./src/__tests__/trello_events/updateCard_idList_3.json",
        settingPath:
          "./src/__tests__/trekin_settings/enableAddDoneTime_1.trekinrc.json5",
      },
      expected: "2020-07-31T02:53:23.814Z",
    },
    {
      name: "doneじゃないのでスキップする",
      input: {
        actionPath: "./src/__tests__/trello_events/updateCard_idList_1.json",
        settingPath:
          "./src/__tests__/trekin_settings/enableAddDoneTime_1.trekinrc.json5",
      },
      expected: "Skip addTimeOfDoneToRecord",
    },
    {
      name: "リスト移動じゃないのでスキップする",
      input: {
        actionPath: "./src/__tests__/trello_events/createCard_1.json",
        settingPath:
          "./src/__tests__/trekin_settings/enableAddDoneTime_1.trekinrc.json5",
      },
      expected: "Skip addTimeOfDoneToRecord",
    },
  ];

  for (const { name, input, expected } of testcases) {
    test(name, async () => {
      KintoneMock.mockImplementation(() => {
        return true;
      });
      getRecordIdFromCardMock.mockImplementation(() => {
        return "1";
      });
      addTimeOfDoneToRecordMock.mockImplementation(
        (_client, _cardId, _recordId, doneTime) => {
          return doneTime;
        }
      );

      const w = await createWorker();
      w.setting = new SettingGuardian(
        JSON5.parse(fs.readFileSync(input.settingPath, "utf-8"))
      );
      const action: Action = JSON.parse(
        await fs.readFileSync(input.actionPath, "utf8")
      ).body.action;
      w.trelloAction = action;

      const actual = await w.addTimeOfDoneToRecord();
      expect(actual).toEqual(expected);
    });
  }
});
