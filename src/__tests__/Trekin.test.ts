/* eslint-disable no-loop-func */

import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import { Action } from "../Trello";
import { Trekin } from "../Trekin";
import * as fs from "fs";
import { CardApp, LabelApp, ListApp, MemberApp } from "../Kintone";

jest.mock("@kintone/rest-api-client");
const KintoneMock = (KintoneRestAPIClient as unknown) as jest.Mock;

const runOperationKintone = async (
  inputFilePath: string,
  mockOverrides: any = undefined
): Promise<any> => {
  KintoneMock.mockImplementation(() => {
    return {
      record: {
        addRecord: () => {
          return Promise.resolve({});
        },
        getRecords: () => {
          return Promise.resolve({
            records: [{ $id: { value: "aaa" } }, { $id: { value: "bbb" } }],
          });
        },
        updateRecord: () => {
          return Promise.resolve({});
        },
        addRecordComment: () => {
          return Promise.resolve({});
        },
        ...mockOverrides,
      },
    };
  });
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

  const action: Action = JSON.parse(
    await fs.readFileSync(inputFilePath, "utf8")
  ).body.action;
  await t.readSetting("./src/__tests__/trekin_settings/.trekinrc.json5");
  return t.operation(action);
};

describe("createCardのテスト", () => {
  const testcases = [
    {
      name: "カードを追加できる",
      input: "./src/__tests__/trello_events/createCard_1.json",
      expected: {
        app: "",
        record: {
          [CardApp.name]: { value: "これは新しいカードです！！" },
          [CardApp.id]: { value: "5f1590bb8a1a602edd449930" },
          [CardApp.link]: { value: "https://trello.com/c/ceDVYykj" },
          [CardApp.idList]: { value: "5f1e8b1ed6438e403c6f18fe" },
        },
      },
    },
    {
      name: "listがjsonにない場合でも追加できる",
      input: "./src/__tests__/trello_events/createCard_2.json",
      expected: {
        app: "",
        record: {
          [CardApp.name]: { value: "これは新しいカードです！！" },
          [CardApp.id]: { value: "5f1590bb8a1a602edd449930" },
          [CardApp.link]: { value: "https://trello.com/c/ceDVYykj" },
        },
      },
    },
  ];

  for (const { name, input, expected } of testcases) {
    test(name, async () => {
      const actual = await runOperationKintone(input);
      expect(actual).toEqual(expected);
    });
  }
});

describe("updateCardのテスト", () => {
  const testcases = [
    {
      name: "oldにキーがある場合recordにもキーが含まれる",
      input: "./src/__tests__/trello_events/updateCard_idList_1.json",
      expected: {
        [CardApp.id]: { value: "newId" },
        [CardApp.name]: { value: "これは新しいカードです！！" },
        [CardApp.idList]: { value: "newIdList" },
      },
    },
    {
      name: "oldにキーがない場合recordにキーは含まれない",
      input: "./src/__tests__/trello_events/updateCard_idList_2.json",
      expected: {
        [CardApp.name]: { value: "これは新しいカードです！！" },
        [CardApp.idList]: { value: "newIdList" },
      },
    },
  ];

  for (const { name, input, expected } of testcases) {
    test(name, async () => {
      const actual = await runOperationKintone(input);
      expect(actual).toEqual(expected);
    });
  }
});

describe("createListのテスト", () => {
  const testcases = [
    {
      name: "リストを追加できる",
      input: "./src/__tests__/trello_events/createList_1.json",
      expected: {
        app: "",
        record: {
          [ListApp.name]: { value: "新しいリスト" },
          [ListApp.id]: { value: "5f1e40c92cfacb6dc5d4bbe5" },
        },
      },
    },
  ];

  for (const { name, input, expected } of testcases) {
    test(name, async () => {
      const actual = await runOperationKintone(input);
      expect(actual).toEqual(expected);
    });
  }
});

describe("updateListのテスト", () => {
  const testcases = [
    {
      name: "リストを更新できる",
      input: "./src/__tests__/trello_events/updateList_1.json",
      expected: {
        [ListApp.name]: { value: "テスト2" },
      },
    },
    {
      name: "リストをアーカイブできる",
      input: "./src/__tests__/trello_events/updateList_closed_1.json",
      expected: {
        [ListApp.closed]: { value: true },
      },
    },
  ];

  for (const { name, input, expected } of testcases) {
    test(name, async () => {
      const actual = await runOperationKintone(input);
      expect(actual).toEqual(expected);
    });
  }
});

describe("createLabelのテスト", () => {
  const testcases = [
    {
      name: "ラベルを追加できる",
      input: "./src/__tests__/trello_events/createLabel_1.json",
      expected: {
        app: "",
        record: {
          [LabelApp.name]: { value: "黒いラベルだよ！" },
          [LabelApp.id]: { value: "5f1e6180d9aed686cc5a1ca5" },
          [LabelApp.color]: { value: "black" },
        },
      },
    },
  ];

  for (const { name, input, expected } of testcases) {
    test(name, async () => {
      const actual = await runOperationKintone(input);
      expect(actual).toEqual(expected);
    });
  }
});

describe("updateLabelのテスト", () => {
  const testcases = [
    {
      name: "ラベルを更新できる",
      input: "./src/__tests__/trello_events/updateLabel_1.json",
      expected: {
        app: "",
        id: "5f02821bf1bb5752f63a5ae5",
        record: {
          [LabelApp.name]: { value: "新しいラベルだ！" },
          [LabelApp.color]: { value: "yellow" },
        },
      },
      mock: {
        getRecords: () => {
          return Promise.resolve({
            records: [{ $id: { value: "5f02821bf1bb5752f63a5ae5" } }],
          });
        },
      },
    },
    {
      name: "ラベルがアプリ上に存在しない場合、作成できる",
      input: "./src/__tests__/trello_events/updateLabel_1.json",
      expected: {
        app: "",
        record: {
          [LabelApp.name]: { value: "新しいラベルだ！" },
          [LabelApp.id]: { value: "5f02821bf1bb5752f63a5ae5" },
          [LabelApp.color]: { value: "yellow" },
        },
      },
      mock: {
        getRecords: () => {
          return Promise.resolve({
            records: [],
          });
        },
      },
    },
  ];

  for (const { name, input, expected, mock } of testcases) {
    test(name, async () => {
      const actual = await runOperationKintone(input, mock);
      expect(actual).toEqual(expected);
    });
  }
});

describe("addLabelToCardのテスト", () => {
  const testcases = [
    {
      name: "ラベルをカードに登録できる",
      isError: false,
      input: "./src/__tests__/trello_events/addLabelToCard_1.json",
      expected: {
        app: "",
        id: "5f1590bb8a1a602edd449930",
        record: {
          [CardApp.labelTable]: {
            value: [{ value: { LABEL_ID: "5f1e6180d9aed686cc5a1ca5" } }],
          },
        },
      },
      mock: {
        getRecords: () => {
          return Promise.resolve({
            records: [
              {
                $id: { value: "5f1590bb8a1a602edd449930" },
                [CardApp.labelTable]: {
                  value: [],
                },
              },
            ],
          });
        },
      },
    },
    {
      name: "すでにラベルがあってもラベルをカードに登録できる",
      isError: false,
      input: "./src/__tests__/trello_events/addLabelToCard_1.json",
      expected: {
        app: "",
        id: "5f1590bb8a1a602edd449930",
        record: {
          [CardApp.labelTable]: {
            value: [
              { id: "2" },
              { id: "3" },
              { value: { LABEL_ID: "5f1e6180d9aed686cc5a1ca5" } },
            ],
          },
        },
      },
      mock: {
        getRecords: () => {
          return Promise.resolve({
            records: [
              {
                $id: { value: "5f1590bb8a1a602edd449930" },
                [CardApp.labelTable]: {
                  value: [
                    {
                      id: 2,
                      value: { LABEL_ID: "alreadyLabelId1", LABEL_NAME: "red" },
                    },
                    {
                      id: 3,
                      value: {
                        LABEL_ID: "alreadyLabelId2",
                        LABEL_NAME: "blue",
                      },
                    },
                  ],
                },
              },
            ],
          });
        },
      },
    },
    {
      name: "すでに同じラベルがあった場合ラベルをカードに追加しない",
      isError: true,
      input: "./src/__tests__/trello_events/addLabelToCard_1.json",
      expected: {
        app: "",
        id: "5f1590bb8a1a602edd449930",
        record: {},
      },
      mock: {
        getRecords: () => {
          return Promise.resolve({
            records: [
              {
                $id: { value: "5f1590bb8a1a602edd449930" },
                [CardApp.labelTable]: {
                  value: [
                    {
                      id: "1",
                      value: {
                        LABEL_ID: { value: "5f1e6180d9aed686cc5a1ca5" },
                        LABEL_NAME: { value: "yellow" },
                      },
                    },
                    {
                      id: 2,
                      value: {
                        LABEL_ID: { value: "alreadyLabelId1" },
                        LABEL_NAME: { value: "red" },
                      },
                    },
                    {
                      id: 3,
                      value: {
                        LABEL_ID: { value: "alreadyLabelId2" },
                        LABEL_NAME: { value: "blue" },
                      },
                    },
                  ],
                },
              },
            ],
          });
        },
      },
    },
  ];

  for (const { name, input, expected, mock, isError } of testcases) {
    test(name, async () => {
      if (isError) {
        const throwFunction = async () => {
          await runOperationKintone(input, mock);
        };
        await expect(throwFunction).rejects.toThrowError(
          new Error("Label gsgaga(5f1e6180d9aed686cc5a1ca5) is already exists")
        );
        return;
      }
      const actual = await runOperationKintone(input, mock);
      expect(actual).toEqual(expected);
    });
  }
});

describe("removeLabelFromCardのテスト", () => {
  const testcases = [
    {
      name: "ラベルからカードを削除できる",
      input: "./src/__tests__/trello_events/removeLabelFromCard_1.json",
      expected: {
        app: "",
        id: "5f1590bb8a1a602edd449930",
        record: {
          [CardApp.labelTable]: {
            value: [],
          },
        },
      },
      mock: {
        getRecords: () => {
          return Promise.resolve({
            records: [
              {
                $id: { value: "5f1590bb8a1a602edd449930" },
                [CardApp.labelTable]: {
                  value: [
                    {
                      id: "1",
                      value: {
                        LABEL_ID: { value: "5f02821bf1bb5752f63a5ae1" },
                        LABEL_NAME: { value: "yellow" },
                      },
                    },
                  ],
                },
              },
            ],
          });
        },
      },
    },
    {
      name: "指定したカードのみ削除できる",
      input: "./src/__tests__/trello_events/removeLabelFromCard_1.json",
      expected: {
        app: "",
        id: "5f1590bb8a1a602edd449930",
        record: {
          [CardApp.labelTable]: {
            value: [{ id: "2" }, { id: "3" }],
          },
        },
      },
      mock: {
        getRecords: () => {
          return Promise.resolve({
            records: [
              {
                $id: { value: "5f1590bb8a1a602edd449930" },
                [CardApp.labelTable]: {
                  value: [
                    {
                      id: "1",
                      value: {
                        LABEL_ID: { value: "5f02821bf1bb5752f63a5ae1" },
                        LABEL_NAME: { value: "yellow" },
                      },
                    },
                    {
                      id: 2,
                      value: {
                        LABEL_ID: { value: "alreadyLabelId1" },
                        LABEL_NAME: { value: "red" },
                      },
                    },
                    {
                      id: 3,
                      value: {
                        LABEL_ID: { value: "alreadyLabelId2" },
                        LABEL_NAME: { value: "blue" },
                      },
                    },
                  ],
                },
              },
            ],
          });
        },
      },
    },
  ];

  for (const { name, input, expected, mock } of testcases) {
    test(name, async () => {
      const actual = await runOperationKintone(input, mock);
      expect(actual).toEqual(expected);
    });
  }
});

describe("addMemberToCardのテスト", () => {
  const testcases = [
    {
      name: "メンバーをカードに登録できる",
      input: "./src/__tests__/trello_events/addMemberToCard_1.json",
      expected: {
        app: "",
        id: "5f1590bb8a1a602edd449930",
        record: {
          [CardApp.member]: { value: [{ code: "aaa" }] },
        },
      },
      mock: {
        getRecords: (params: any) => {
          let returnValue: any;
          if (params.fields.includes(CardApp.member)) {
            returnValue = {
              records: [
                {
                  $id: { value: "5f1590bb8a1a602edd449930" },
                  [CardApp.member]: { value: [] },
                },
              ],
            };
          } else {
            returnValue = {
              records: [
                {
                  $id: { value: "5f1590bb8a1a602edd449930" },
                  [MemberApp.kintoneUser]: {
                    value: [{ code: "aaa", name: "aaaa" }],
                  },
                },
              ],
            };
          }
          return Promise.resolve(returnValue);
        },
      },
    },
    {
      name:
        "すでに他のメンバが登録されている状態でメンバを増やしてもすでにいるメンバは消えない",
      input: "./src/__tests__/trello_events/addMemberToCard_1.json",
      expected: {
        app: "",
        id: "5f1590bb8a1a602edd449930",
        record: {
          [CardApp.member]: {
            value: [
              { code: "other user1" },
              { code: "other user2" },
              { code: "user" },
            ],
          },
        },
      },
      mock: {
        getRecords: (params: any) => {
          let returnValue: any;
          if (params.fields.includes(CardApp.member)) {
            returnValue = {
              records: [
                {
                  $id: { value: "5f1590bb8a1a602edd449930" },
                  [CardApp.member]: {
                    value: [
                      { code: "other user1", name: "aaaa" },
                      { code: "other user2", name: "aaaa" },
                    ],
                  },
                },
              ],
            };
          } else {
            returnValue = {
              records: [
                {
                  $id: { value: "5f1590bb8a1a602edd449930" },
                  [MemberApp.kintoneUser]: {
                    value: [{ code: "user", name: "aaaa" }],
                  },
                },
              ],
            };
          }
          return Promise.resolve(returnValue);
        },
      },
    },
  ];

  for (const { name, input, expected, mock } of testcases) {
    test(name, async () => {
      const actual = await runOperationKintone(input, mock);
      expect(actual).toEqual(expected);
    });
  }
});

describe("removeMemberFromCardのテスト", () => {
  const testcases = [
    {
      name: "メンバーをカードから削除できる",
      input: "./src/__tests__/trello_events/removeMemberFromCard_1.json",
      expected: {
        app: "",
        id: "5f1590bb8a1a602edd449930",
        record: {
          [CardApp.member]: { value: [] },
        },
      },
      mock: {
        getRecords: (params: any) => {
          let returnValue: any;
          if (params.fields.includes(CardApp.member)) {
            returnValue = {
              records: [
                {
                  $id: { value: "5f1590bb8a1a602edd449930" },
                  [CardApp.member]: {
                    value: [{ code: "aaa", name: "aaaa" }],
                  },
                },
              ],
            };
          } else {
            returnValue = {
              records: [
                {
                  $id: { value: "5f1590bb8a1a602edd449930" },
                  [MemberApp.kintoneUser]: {
                    value: [{ code: "aaa", name: "aaaa" }],
                  },
                },
              ],
            };
          }
          return Promise.resolve(returnValue);
        },
      },
    },
    {
      name:
        "すでに他のメンバが登録されている状態でメンバを消してもすでにいるメンバは消えない",
      input: "./src/__tests__/trello_events/removeMemberFromCard_1.json",
      expected: {
        app: "",
        id: "5f1590bb8a1a602edd449930",
        record: {
          [CardApp.member]: {
            value: [{ code: "other user1" }, { code: "other user2" }],
          },
        },
      },
      mock: {
        getRecords: (params: any) => {
          let returnValue: any;
          if (params.fields.includes(CardApp.member)) {
            returnValue = {
              records: [
                {
                  $id: { value: "5f1590bb8a1a602edd449930" },
                  [CardApp.member]: {
                    value: [
                      { code: "other user1", name: "aaaa" },
                      { code: "other user2", name: "aaaa" },
                      { code: "user", name: "aaaa" },
                    ],
                  },
                },
              ],
            };
          } else {
            returnValue = {
              records: [
                {
                  $id: { value: "5f1590bb8a1a602edd449930" },
                  [MemberApp.kintoneUser]: {
                    value: [{ code: "user", name: "aaaa" }],
                  },
                },
              ],
            };
          }
          return Promise.resolve(returnValue);
        },
      },
    },
  ];

  for (const { name, input, expected, mock } of testcases) {
    test(name, async () => {
      const actual = await runOperationKintone(input, mock);
      expect(actual).toEqual(expected);
    });
  }
});

describe("copyCardのテスト", () => {
  const testcases = [
    {
      name: "カードを追加できる",
      input: "./src/__tests__/trello_events/copyCard_1.json",
      expected: {
        app: "",
        record: {
          [CardApp.name]: { value: "これは新しいカードです！！" },
          [CardApp.id]: { value: "5f1590bb8a1a602edd449930" },
          [CardApp.link]: { value: "https://trello.com/c/ceDVYykj" },
          [CardApp.idList]: { value: "5f1e8b1ed6438e403c6f18fe" },
        },
      },
    },
    {
      name: "listがjsonにない場合でも追加できる",
      input: "./src/__tests__/trello_events/copyCard_2.json",
      expected: {
        app: "",
        record: {
          [CardApp.name]: { value: "これは新しいカードです！！" },
          [CardApp.id]: { value: "5f1590bb8a1a602edd449930" },
          [CardApp.link]: { value: "https://trello.com/c/ceDVYykj" },
        },
      },
    },
  ];

  for (const { name, input, expected } of testcases) {
    test(name, async () => {
      const actual = await runOperationKintone(input);
      expect(actual).toEqual(expected);
    });
  }
});

describe("commentCardのテスト", () => {
  const testcases = [
    {
      name: "カードにコメントを登録できる",
      input: "./src/__tests__/trello_events/commentCard_1.json",
      expected: {
        app: "",
        record: "aaa",
        comment: {
          text: "korosuke613:Futa Hirakoba (平木場 風太)\n\nコメントだよ",
        },
      },
    },
  ];

  for (const { name, input, expected } of testcases) {
    test(name, async () => {
      const actual = await runOperationKintone(input);
      expect(actual).toEqual(expected);
    });
  }
});

describe("addAttachmentToCardのテスト", () => {
  const testcases = [
    {
      name: "すでに添付ファイルがあっても追加できる",
      input: "./src/__tests__/trello_events/addAttachmentToCard_image_1.json",
      expected: {
        app: "",
        id: "5f1590bb8a1a602edd449930",
        record: {
          ATTACHMENT_TABLE: {
            value: [
              {
                id: "user",
              },
              {
                value: {
                  ATTACHMENT_LINK:
                    "https://trello-attachments.s3.amazonaws.com/5f02821bf3e65f322beb3ea4/5f1e865323566c0f75e0c961/a55cc55c80fb1acaef879692dd13f4b1/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2020-08-23_14.22.18.png",
                  ATTACHMENT_NAME: "スクリーンショット 2020-08-23 14.22.18.png",
                },
              },
            ],
          },
        },
      },
      mock: {
        getRecords: (params: any) => {
          const returnValue = {
            records: [
              {
                $id: { value: "5f1590bb8a1a602edd449930" },
                [CardApp.attachmentTable]: {
                  value: [{ id: "user", name: "aaaa" }],
                },
              },
            ],
          };
          return Promise.resolve(returnValue);
        },
      },
    },
    {
      name: "添付ファイルがなくても追加できる",
      input: "./src/__tests__/trello_events/addAttachmentToCard_link_1.json",
      expected: {
        app: "",
        id: "5f1590bb8a1a602edd449930",
        record: {
          ATTACHMENT_TABLE: {
            value: [
              {
                value: {
                  ATTACHMENT_LINK:
                    "https://trello.com/b/Sqsia9EM/trello-api%E3%83%86%E3%82%B9%E3%83%88",
                  ATTACHMENT_NAME:
                    "https://trello.com/b/Sqsia9EM/trello-api%E3%83%86%E3%82%B9%E3%83%88",
                },
              },
            ],
          },
        },
      },
      mock: {
        getRecords: (params: any) => {
          const returnValue = {
            records: [
              {
                $id: { value: "5f1590bb8a1a602edd449930" },
                [CardApp.attachmentTable]: {
                  value: [],
                },
              },
            ],
          };
          return Promise.resolve(returnValue);
        },
      },
    },
  ];

  for (const { name, input, expected, mock } of testcases) {
    test(name, async () => {
      const actual = await runOperationKintone(input, mock);
      expect(actual).toEqual(expected);
    });
  }
});
