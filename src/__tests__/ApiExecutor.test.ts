/* eslint-disable no-loop-func */

import {
  getKintoneUserCode,
  getKintoneUserCodesOfSetted,
  getRecordIdAndLabelIdsFromCard,
  getRecordIdFromCard,
  getRecordIdFromLabelOfSame,
  getRecordIdFromList,
} from "../ApiExecutor";
import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import { Data } from "../Trello";
import { CardApp, MemberApp } from "../AppFieldIDs";

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
