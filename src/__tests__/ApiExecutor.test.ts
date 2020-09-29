/* eslint-disable no-loop-func */

import { ApiExecutor } from "../ApiExecutor";
import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import { Data } from "../Trello";
import { CardApp, LabelApp, ListApp, MemberApp } from "../Kintone";
import retryTimes = jest.retryTimes;

jest.mock("@kintone/rest-api-client");
// jest.mock("node-fetch");

const KintoneMock = (KintoneRestAPIClient as unknown) as jest.Mock;

describe("getRecordIdFromCardのテスト", () => {
  const testcases = [
    {
      name: "見つかったidのレコードidを返す",
      mockReturn: {
        records: [
          {
            $id: {
              value: "aaa",
            },
          },
        ],
      },
      expected: "aaa",
    },
    {
      name: "レコードが存在しない場合のundefindを返す",
      mockReturn: {
        records: [],
      },
      expected: undefined,
    },
  ];

  for (const { name, mockReturn, expected } of testcases) {
    test(name, async () => {
      KintoneMock.mockImplementationOnce(() => {
        return {
          record: {
            getRecords: () => {
              return mockReturn;
            },
          },
        };
      });
      const k = new KintoneMock();

      const actual = await ApiExecutor.getRecordIdFromCard(k, "", {
        card: { id: "" },
      } as Data);
      expect(actual).toEqual(expected);
    });
  }
});

describe("getRecordIdFromListのテスト", () => {
  const testcases = [
    {
      name: "見つかったidのレコードidを返す(list)",
      mockReturn: {
        records: [
          {
            $id: {
              value: "aaa",
            },
          },
        ],
      },
      input: {
        list: {
          id: "",
        },
      },
      expected: "aaa",
    },
    {
      name: "見つかったidのレコードidを返す(listAfter)",
      mockReturn: {
        records: [
          {
            $id: {
              value: "aaa",
            },
          },
        ],
      },
      input: {
        listAfter: {
          id: "",
        },
      },
      expected: "aaa",
    },
    {
      name: "listもlistAfterもない場合undefindを返す",
      mockReturn: {
        records: [
          {
            $id: {
              value: "aaa",
            },
          },
        ],
      },
      input: {},
      expected: undefined,
    },
    {
      name: "レコードが存在しない場合のundefindを返す",
      mockReturn: {
        records: [],
      },
      input: {
        list: {
          id: "",
        },
      },
      expected: undefined,
    },
  ];

  for (const { name, mockReturn, input, expected } of testcases) {
    test(name, async () => {
      KintoneMock.mockImplementationOnce(() => {
        return {
          record: {
            getRecords: () => {
              return mockReturn;
            },
          },
        };
      });
      const k = new KintoneMock();

      const actual = await ApiExecutor.getRecordIdFromList(
        k,
        "",
        input as Data
      );
      expect(actual).toEqual(expected);
    });
  }
});

describe("getRecordIdFromLabelOfSameのテスト", () => {
  const testcases = [
    {
      name: "見つかったidのレコードidを返す",
      mockReturn: {
        records: [
          {
            $id: {
              value: "aaa",
            },
          },
        ],
      },
      expected: "aaa",
    },
    {
      name: "レコードが存在しない場合のundefindを返す",
      mockReturn: {
        records: [],
      },
      expected: undefined,
    },
  ];

  for (const { name, mockReturn, expected } of testcases) {
    test(name, async () => {
      KintoneMock.mockImplementationOnce(() => {
        return {
          record: {
            getRecords: () => {
              return mockReturn;
            },
          },
        };
      });
      const k = new KintoneMock();

      const actual = await ApiExecutor.getRecordIdFromLabelOfSame(k, "", {
        label: { id: "" },
      } as Data);
      expect(actual).toEqual(expected);
    });
  }
});

describe("getKintoneUserCodeのテスト", () => {
  const testcases = [
    {
      name: "見つかったidのkintoneユーザーコードを返す",
      mockReturn: {
        records: [
          {
            $id: {
              value: "aaa",
            },
            [MemberApp.kintoneUser]: {
              value: [
                {
                  code: "kintone code",
                  name: "",
                },
              ],
            },
          },
        ],
      },
      expected: "kintone code",
    },
    {
      name: "レコードが存在しない場合のundefindを返す",
      mockReturn: {
        records: [],
      },
      expected: undefined,
    },
  ];

  for (const { name, mockReturn, expected } of testcases) {
    test(name, async () => {
      KintoneMock.mockImplementationOnce(() => {
        return {
          record: {
            getRecords: () => {
              return mockReturn;
            },
          },
        };
      });
      const k = new KintoneMock();

      const actual = await ApiExecutor.getKintoneUserCode(k, "", {
        member: { id: "" },
      } as Data);
      expect(actual).toEqual(expected);
    });
  }
});

describe("getKintoneUserCodesOfSettedのテスト", () => {
  const testcases = [
    {
      name: "見つかったidのkintoneユーザーコードを返す",
      mockReturn: {
        records: [
          {
            $id: {
              value: "aaa",
            },
            [CardApp.member]: {
              value: [
                {
                  code: "kintone code 1",
                  name: "",
                },
                {
                  code: "kintone code 2",
                  name: "",
                },
              ],
            },
          },
        ],
      },
      expected: ["kintone code 1", "kintone code 2"],
    },
    {
      name: "レコードが存在しない場合のundefindを返す",
      mockReturn: {
        records: [],
      },
      expected: [],
    },
  ];

  for (const { name, mockReturn, expected } of testcases) {
    test(name, async () => {
      KintoneMock.mockImplementationOnce(() => {
        return {
          record: {
            getRecords: () => {
              return mockReturn;
            },
          },
        };
      });
      const k = new KintoneMock();

      const actual = await ApiExecutor.getKintoneUserCodesOfSetted(k, "", {
        card: { id: "" },
      } as Data);
      expect(actual).toEqual(expected);
    });
  }
});

describe("getRecordIdAndLabelIdsFromCardのテスト", () => {
  const testcases = [
    {
      name: "見つかったidのレコードidとtableIdsを返す",
      mockReturn: {
        records: [
          {
            $id: {
              value: "aaa",
            },
            [CardApp.labelTable]: {
              value: [
                { id: "1", value: { LABEL_ID: "aaa", LABEL_NAME: "label_1" } },
                { id: "2", value: { LABEL_ID: "bbb", LABEL_NAME: "label_2" } },
              ],
            },
          },
        ],
      },
      expected: {
        recordId: "aaa",
        tableIds: [
          { id: "1", value: { LABEL_ID: "aaa", LABEL_NAME: "label_1" } },
          { id: "2", value: { LABEL_ID: "bbb", LABEL_NAME: "label_2" } },
        ],
      },
    },
    {
      name: "レコードが存在しない場合のundefindを返す",
      mockReturn: {
        records: [],
      },
      expected: undefined,
    },
  ];

  for (const { name, mockReturn, expected } of testcases) {
    test(name, async () => {
      KintoneMock.mockImplementationOnce(() => {
        return {
          record: {
            getRecords: () => {
              return mockReturn;
            },
          },
        };
      });
      const k = new KintoneMock();

      const actual = await ApiExecutor.getRecordIdAndLabelIdsFromCard(k, "", {
        card: { id: "" },
      } as Data);
      expect(actual).toEqual(expected);
    });
  }
});

describe("addMemberのテスト", () => {
  const testcases = [
    {
      name: "RecordParamに入るべき値が正しい",
      mockReturn: {},
      expected: {
        app: "appId",
        record: {
          [MemberApp.trelloId]: { value: "id" },
          [MemberApp.name]: { value: "name" },
          [MemberApp.kintoneUser]: {
            value: [{ code: "kintoneUserCode" }],
          },
        },
      },
    },
  ];

  for (const { name, mockReturn, expected } of testcases) {
    test(name, async () => {
      KintoneMock.mockImplementationOnce(() => {
        return {
          record: {
            addRecord: () => {
              return Promise.resolve(mockReturn);
            },
          },
        };
      });
      const k = new KintoneMock();

      const actual = await ApiExecutor.addMember(
        k,
        "appId",
        {
          member: { id: "id", name: "name" },
        } as Data,
        "kintoneUserCode"
      );
      expect(actual).toEqual(expected);
    });
  }
});

describe("createCardのテスト", () => {
  const testcases = [
    {
      name: "RecordParamに入るべき値が正しい",
      input: { card: { id: "id", name: "name", shortLink: "anyLink" } },
      expected: {
        app: "appId",
        record: {
          [CardApp.id]: { value: "id" },
          [CardApp.name]: { value: "name" },
          [CardApp.link]: { value: "https://trello.com/c/anyLink" },
        },
      },
    },
    {
      name: "trelloイベントにlistがあったらRecordParamにlistも入る",
      input: {
        card: { id: "id", name: "name", shortLink: "anyLink" },
        list: { id: "listId" },
      },
      expected: {
        app: "appId",
        record: {
          [CardApp.id]: { value: "id" },
          [CardApp.name]: { value: "name" },
          [CardApp.link]: { value: "https://trello.com/c/anyLink" },
          [CardApp.idList]: { value: "listId" },
        },
      },
    },
  ];

  for (const { name, input, expected } of testcases) {
    test(name, async () => {
      KintoneMock.mockImplementationOnce(() => {
        return {
          record: {
            addRecord: () => {
              return Promise.resolve({});
            },
          },
        };
      });
      const k = new KintoneMock();

      const actual = await ApiExecutor.createCard(k, "appId", input as Data);
      expect(actual).toEqual(expected);
    });
  }
});

describe("updateCardのテスト", () => {
  const testcases = [
    {
      name: "oldにキーがある場合recordにもキーが含まれる",
      input1: {
        card: { id: "id", name: "name", desc: "desc" },
        old: { id: "oldId", name: "oldName", desc: "oldDesc" },
      },
      input2: "recordId",
      expected: {
        [CardApp.id]: { value: "id" },
        [CardApp.name]: { value: "name" },
        [CardApp.desc]: { value: "desc" },
      },
    },
    {
      name: "oldにキーがない場合recordにキーは含まれない",
      input1: {
        card: { id: "id", name: "name", desc: "desc" },
        old: { name: "oldName", desc: "oldDesc" },
      },
      input2: "recordId",
      expected: {
        [CardApp.name]: { value: "name" },
        [CardApp.desc]: { value: "desc" },
      },
    },
  ];

  for (const { name, input1, input2, expected } of testcases) {
    test(name, async () => {
      KintoneMock.mockImplementationOnce(() => {
        return {
          record: {
            updateRecord: () => {
              return Promise.resolve({});
            },
          },
        };
      });
      const k = new KintoneMock();

      const actual = await ApiExecutor.updateCard(
        k,
        "appId",
        input1 as Data,
        input2
      );
      expect(actual).toEqual(expected);
    });
  }
});

describe("createListのテスト", () => {
  const testcases = [
    {
      name: "RecordParamに入るべき値が正しい",
      input: { list: { id: "id", name: "name" } },
      expected: {
        app: "appId",
        record: {
          [ListApp.id]: { value: "id" },
          [ListApp.name]: { value: "name" },
        },
      },
    },
    {
      name: "listAfterでも入力できる",
      input: { listAfter: { id: "id", name: "name" } },
      expected: {
        app: "appId",
        record: {
          [ListApp.id]: { value: "id" },
          [ListApp.name]: { value: "name" },
        },
      },
    },
  ];

  for (const { name, input, expected } of testcases) {
    test(name, async () => {
      KintoneMock.mockImplementationOnce(() => {
        return {
          record: {
            addRecord: () => {
              return Promise.resolve({});
            },
          },
        };
      });
      const k = new KintoneMock();

      const actual = await ApiExecutor.createList(k, "appId", input as Data);
      expect(actual).toEqual(expected);
    });
  }
});

describe("updateListのテスト", () => {
  const testcases = [
    {
      name: "oldにキーがある場合recordにもキーが含まれる",
      input1: {
        list: { id: "id", name: "name" },
        old: { id: "oldId", name: "oldName" },
      },
      input2: "recordId",
      expected: {
        [ListApp.id]: { value: "id" },
        [ListApp.name]: { value: "name" },
      },
    },
    {
      name: "oldにキーがない場合recordにキーは含まれない",
      input1: {
        list: { id: "id", name: "name" },
        old: { name: "oldName" },
      },
      input2: "recordId",
      expected: {
        [ListApp.name]: { value: "name" },
      },
    },
  ];

  for (const { name, input1, input2, expected } of testcases) {
    test(name, async () => {
      KintoneMock.mockImplementationOnce(() => {
        return {
          record: {
            updateRecord: () => {
              return Promise.resolve({});
            },
          },
        };
      });
      const k = new KintoneMock();

      const actual = await ApiExecutor.updateList(
        k,
        "appId",
        input1 as Data,
        input2
      );
      expect(actual).toEqual(expected);
    });
  }
});

describe("createLabelのテスト", () => {
  const testcases = [
    {
      name: "RecordParamに入るべき値が正しい",
      input: { label: { id: "id", name: "name", color: "color" } },
      expected: {
        app: "appId",
        record: {
          [LabelApp.id]: { value: "id" },
          [LabelApp.name]: { value: "name" },
          [LabelApp.color]: { value: "color" },
        },
      },
    },
  ];

  for (const { name, input, expected } of testcases) {
    test(name, async () => {
      KintoneMock.mockImplementationOnce(() => {
        return {
          record: {
            addRecord: () => {
              return Promise.resolve({});
            },
          },
        };
      });
      const k = new KintoneMock();

      const actual = await ApiExecutor.createLabel(k, "appId", input as Data);
      expect(actual).toEqual(expected);
    });
  }
});

describe("updateLabelのテスト", () => {
  const testcases = [
    {
      name: "oldにキーがある場合recordにもキーが含まれる",
      input1: {
        label: { name: "name", color: "color" },
      },
      input2: "recordId",
      expected: {
        app: "appId",
        id: "recordId",
        record: {
          [LabelApp.name]: { value: "name" },
          [LabelApp.color]: { value: "color" },
        },
      },
    },
  ];

  for (const { name, input1, input2, expected } of testcases) {
    test(name, async () => {
      KintoneMock.mockImplementationOnce(() => {
        return {
          record: {
            updateRecord: () => {
              return Promise.resolve({});
            },
          },
        };
      });
      const k = new KintoneMock();

      const actual = await ApiExecutor.updateLabel(
        k,
        "appId",
        input1 as Data,
        input2
      );
      expect(actual).toEqual(expected);
    });
  }
});

describe("addLabelToCardのテスト", () => {
  const testcases = [
    {
      name: "RecordParamに入るべき値が正しい",
      input1: {
        label: { id: "id", name: "name", color: "color" },
      },
      input2: "recordId",
      input3: [
        {
          id: "alreadyLabelId1",
          value: { LABEL_ID: "alreadyLabelId1", LABEL_NAME: "red" },
        },
        {
          id: "alreadyLabelId2",
          value: { LABEL_ID: "alreadyLabelId2", LABEL_NAME: "blue" },
        },
      ],
      expected: {
        app: "appId",
        id: "recordId",
        record: {
          [CardApp.labelTable]: {
            value: [
              { id: "alreadyLabelId1" },
              { id: "alreadyLabelId2" },
              {
                value: {
                  [CardApp.labelId]: "id",
                },
              },
            ],
          },
        },
      },
    },
  ];

  for (const { name, input1, input2, input3, expected } of testcases) {
    test(name, async () => {
      KintoneMock.mockImplementationOnce(() => {
        return {
          record: {
            updateRecord: () => {
              return Promise.resolve({});
            },
          },
        };
      });
      const k = new KintoneMock();

      const actual = await ApiExecutor.addLabelToCard(
        k,
        "appId",
        input1 as Data,
        input2,
        input3
      );
      expect(actual).toEqual(expected);
    });
  }
});

describe("addMemberToCardのテスト", () => {
  const testcases = [
    {
      name: "RecordParamに入るべき値が正しい",
      input1: "appId",
      input2: "cardId",
      input3: "kintoneUserCode",
      input4: ["alreadyKintoneUser1", "alreadyKintoneUser2"],
      expected: {
        app: "appId",
        id: "cardId",
        record: {
          [CardApp.member]: {
            value: [
              { code: "alreadyKintoneUser1" },
              { code: "alreadyKintoneUser2" },
              {
                code: "kintoneUserCode",
              },
            ],
          },
        },
      },
    },
  ];

  for (const { name, input1, input2, input3, input4, expected } of testcases) {
    test(name, async () => {
      KintoneMock.mockImplementationOnce(() => {
        return {
          record: {
            updateRecord: () => {
              return Promise.resolve({});
            },
          },
        };
      });
      const k = new KintoneMock();

      const actual = await ApiExecutor.addMemberToCard(
        k,
        input1,
        input2,
        input3,
        input4
      );
      expect(actual).toEqual(expected);
    });
  }
});

describe("removeMemberFromCardのテスト", () => {
  const testcases = [
    {
      name: "RecordParamに入るべき値が正しい",
      input1: "appId",
      input2: "cardId",
      input3: "kintoneUserCode",
      input4: ["alreadyKintoneUser1", "alreadyKintoneUser2"],
      expected: {
        app: "appId",
        id: "cardId",
        record: {
          [CardApp.member]: {
            value: [
              { code: "alreadyKintoneUser1" },
              { code: "alreadyKintoneUser2" },
            ],
          },
        },
      },
    },
  ];

  for (const { name, input1, input2, input3, input4, expected } of testcases) {
    test(name, async () => {
      KintoneMock.mockImplementationOnce(() => {
        return {
          record: {
            updateRecord: () => {
              return Promise.resolve({});
            },
          },
        };
      });
      const k = new KintoneMock();

      const actual = await ApiExecutor.removeMemberFromCard(
        k,
        input1,
        input2,
        input3,
        input4
      );
      expect(actual).toEqual(expected);
    });
  }
});

describe("registerRecordIdToTrelloのテスト", () => {
  const testcases = [
    {
      name: "RecordParamに入るべき値が正しい",
      input: { card: { id: "id", name: "name", shortLink: "anyLink" } },
      expected: {
        status: 200,
        statusText: "OK",
        text: "ok text",
        url:
          "https://api.trello.com/1/cards/cardID/attachments?key=trelloApiKey&token=trelloApiToken&name=EPTRE-13&url=https%3A%2F%2Fexample.com%2Fk%2F32%2Fshow%23record%3D13",
      },
    },
  ];

  for (const { name, input, expected } of testcases) {
    test(name, async () => {
      jest.mock("node-fetch", () => {
        return (url: string) => {
          return Promise.resolve({
            status: 200,
            statusText: "OK",
            text: () => {
              return "ok text";
            },
            url: url,
          });
        };
      });

      const actual = await ApiExecutor.registerRecordIdToTrello(
        "cardID",
        "https://example.com/",
        "32",
        "trelloApiKey",
        "trelloApiToken",
        "13"
      );
      expect(actual).toEqual(expected);
    });
  }
});

describe("addRecordIdToCardNameOfTrelloのテスト", () => {
  const testcases = [
    {
      name: "カード名にIDがつく",
      input: {
        nowCardName: "カード名だよ",
        eptreId: "123",
      },
      expected: {
        newName: "EPTRE-123: カード名だよ",
        status: 200,
        statusText: "OK",
        text: "ok text",
        url:
          "https://api.trello.com/1/cards/cardId?key=trelloApiKey&token=trelloApiToken&name=EPTRE-123:%20%E3%82%AB%E3%83%BC%E3%83%89%E5%90%8D%E3%81%A0%E3%82%88",
      },
    },
    {
      name: "カード名にすでに同じIDがついてるのでスキップする",
      input: {
        nowCardName: "EPTRE-123: カード名だよ",
        eptreId: "123",
      },
      expected: undefined,
    },
    {
      name: "カード名に別のIDがついてるので上書きする",
      input: {
        nowCardName: "EPTRE-123: カード名だよ(コピー)",
        eptreId: "125",
      },
      expected: {
        newName: "EPTRE-125: カード名だよ(コピー)",
        status: 200,
        statusText: "OK",
        text: "ok text",
        url:
          "https://api.trello.com/1/cards/cardId?key=trelloApiKey&token=trelloApiToken&name=EPTRE-125:%20%E3%82%AB%E3%83%BC%E3%83%89%E5%90%8D%E3%81%A0%E3%82%88(%E3%82%B3%E3%83%94%E3%83%BC)",
      },
    },
    {
      name: "カード名に別のIDがついてるが先頭じゃないので無視する",
      input: {
        nowCardName: "EPTRE-123をぶっ壊す",
        eptreId: "126",
      },
      expected: {
        newName: "EPTRE-126: EPTRE-123をぶっ壊す",
        status: 200,
        statusText: "OK",
        text: "ok text",
        url:
          "https://api.trello.com/1/cards/cardId?key=trelloApiKey&token=trelloApiToken&name=EPTRE-126:%20EPTRE-123%E3%82%92%E3%81%B6%E3%81%A3%E5%A3%8A%E3%81%99",
      },
    },
    {
      name: "カード名にアンパサントが含まれている場合、全角に直す",
      input: {
        nowCardName: "ああああヒアリング & ああああああナイトについて考える",
        eptreId: "126",
      },
      expected: {
        newName:
          "EPTRE-126: ああああヒアリング ＆ ああああああナイトについて考える",
        status: 200,
        statusText: "OK",
        text: "ok text",
        url:
          "https://api.trello.com/1/cards/cardId?key=trelloApiKey&token=trelloApiToken&name=EPTRE-126:%20%E3%81%82%E3%81%82%E3%81%82%E3%81%82%E3%83%92%E3%82%A2%E3%83%AA%E3%83%B3%E3%82%B0%20%EF%BC%86%20%E3%81%82%E3%81%82%E3%81%82%E3%81%82%E3%81%82%E3%81%82%E3%83%8A%E3%82%A4%E3%83%88%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6%E8%80%83%E3%81%88%E3%82%8B",
      },
    },
  ];

  for (const { name, input, expected } of testcases) {
    test(name, async () => {
      jest.mock("node-fetch", () => {
        return (url: string) => {
          return Promise.resolve({
            status: 200,
            statusText: "OK",
            text: () => {
              return "ok text";
            },
            url: url,
          });
        };
      });

      const actual = await ApiExecutor.addRecordIdToCardNameOfTrello(
        "cardId",
        "trelloApiKey",
        "trelloApiToken",
        input.nowCardName,
        input.eptreId
      );
      expect(actual).toEqual(expected);
    });
  }
});
