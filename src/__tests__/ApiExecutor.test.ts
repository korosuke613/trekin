/* eslint-disable no-loop-func */

import {
  addLabelToCard,
  addMember,
  addMemberToCard,
  createCard,
  createLabel,
  createList,
  getKintoneUserCode,
  getKintoneUserCodesOfSetted,
  getRecordIdAndLabelIdsFromCard,
  getRecordIdFromCard,
  getRecordIdFromLabelOfSame,
  getRecordIdFromList,
  removeMemberFromCard,
  updateCard,
  updateLabel,
  updateList,
} from "../ApiExecutor";
import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import { Data } from "../Trello";
import { CardApp, LabelApp, ListApp, MemberApp } from "../AppFieldIDs";

jest.mock("@kintone/rest-api-client");

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

      const actual = await getRecordIdFromCard(k, "", {
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

      const actual = await getRecordIdFromList(k, "", input as Data);
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

      const actual = await getRecordIdFromLabelOfSame(k, "", {
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

      const actual = await getKintoneUserCode(k, "", {
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

      const actual = await getKintoneUserCodesOfSetted(k, "", {
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
              value: [{ id: "label_1" }, { id: "label_2" }],
            },
          },
        ],
      },
      expected: {
        recordId: "aaa",
        tableIds: ["label_1", "label_2"],
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

      const actual = await getRecordIdAndLabelIdsFromCard(k, "", {
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

      const actual = await addMember(
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
      input: { card: { id: "id", text: "name", shortLink: "anyLink" } },
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
        card: { id: "id", text: "name", shortLink: "anyLink" },
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

      const actual = await createCard(k, "appId", input as Data);
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

      const actual = await updateCard(k, "appId", input1 as Data, input2);
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

      const actual = await createList(k, "appId", input as Data);
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

      const actual = await updateList(k, "appId", input1 as Data, input2);
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

      const actual = await createLabel(k, "appId", input as Data);
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

      const actual = await updateLabel(k, "appId", input1 as Data, input2);
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
      input3: ["alreadyLabelId1", "alreadyLabelId2"],
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

      const actual = await addLabelToCard(
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

      const actual = await addMemberToCard(k, input1, input2, input3, input4);
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

      const actual = await removeMemberFromCard(
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
