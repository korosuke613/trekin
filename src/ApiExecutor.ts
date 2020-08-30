import { CardApp, LabelApp, ListApp, MemberApp } from "./AppFieldIDs";
import { Data, ListShort } from "./Trello";
import { KintoneRestAPIClient } from "@kintone/rest-api-client";

/**
 * Cardアプリからtrelloのカードに一致するレコードIDを取得する
 * @param client
 * @param appId
 * @param data
 */
export const getRecordIdFromCard = async (
  client: KintoneRestAPIClient,
  appId: string,
  data: Data
): Promise<string | undefined> => {
  const cardId = data.card.id;
  const res = await client.record.getRecords({
    app: appId,
    fields: ["$id"],
    query: `${CardApp.id}="${cardId}"`,
  });
  if (res.records.length === 0) {
    return undefined;
  }
  const recordId =
    res.records[0].$id.value !== null
      ? res.records[0].$id.value.toString()
      : "";
  console.info(`EVENT\nRecord ID: ${recordId}`);

  return recordId;
};

/**
 * Listアプリからtrelloのリストに一致するレコードIDを取得する
 * @param client
 * @param appId
 * @param data
 */
export const getRecordIdFromList = async (
  client: KintoneRestAPIClient,
  appId: string,
  data: Data
): Promise<string | undefined> => {
  const listValue = typeof data.list === "object" ? data.list : data.listAfter;

  if (listValue === undefined) {
    return undefined;
  }

  const res = await client.record.getRecords({
    app: appId,
    fields: ["$id"],
    query: `${ListApp.id}="${listValue.id}"`,
  });
  if (res.records.length === 0) {
    return undefined;
  }
  const recordId =
    res.records[0].$id.value !== null
      ? res.records[0].$id.value.toString()
      : "";
  console.info(`EVENT\nRecord ID: ${recordId}`);

  return recordId;
};

/**
 * ラベルアプリからラベルのIDを取得する
 * @param client
 * @param appId
 * @param data
 */
export const getRecordIdFromLabelOfSame = async (
  client: KintoneRestAPIClient,
  appId: string,
  data: Data
): Promise<string | undefined> => {
  const labelId = data.label.id;
  const res = await client.record.getRecords({
    app: appId,
    fields: ["$id"],
    query: `${LabelApp.id}="${labelId}"`,
  });
  if (res.records.length === 0) {
    return undefined;
  }
  const recordId =
    res.records[0].$id.value !== null
      ? res.records[0].$id.value.toString()
      : "";
  console.info(`EVENT\nRecord ID: ${recordId}`);

  return recordId;
};

/**
 * trelloのIDに紐づいてるkintoneのユーザコードを取得する
 * @param client
 * @param appId
 * @param data
 */
export const getKintoneUserCode = async (
  client: KintoneRestAPIClient,
  appId: string,
  data: Data
): Promise<string | undefined> => {
  const memberId = data.member.id;
  const res = await client.record.getRecords({
    app: appId,
    fields: [MemberApp.kintoneUser],
    query: `${MemberApp.trelloId}="${memberId}"`,
  });
  if (res.records.length === 0) {
    return undefined;
  }
  const kintoneUsers = res.records[0][MemberApp.kintoneUser].value as Array<{
    code: string;
    name: string;
  }>;
  const kintoneUser =
    kintoneUsers !== null
      ? (kintoneUsers[0] as { code: string; name: string })
      : { code: "", name: "" };
  const kintoneUserCode = kintoneUser.code;
  console.info(`EVENT\nKINTONE_USER: ${kintoneUserCode}`);

  return kintoneUserCode;
};

/**
 * すでにアサインされているkintoneユーザのcodeを取得する
 * @param client
 * @param appId
 * @param data
 */
export const getKintoneUserCodesOfSetted = async (
  client: KintoneRestAPIClient,
  appId: string,
  data: Data
): Promise<string[] | undefined> => {
  const cardId = data.card.id;
  const res = await client.record.getRecords({
    app: appId,
    fields: [CardApp.member],
    query: `${CardApp.id}="${cardId}"`,
  });
  if (res.records.length === 0) {
    return undefined;
  }
  const members = res.records[0][CardApp.member].value as Array<{
    code: string;
    name: string;
  }>;
  const memberCodes = members.map((x) => x.code);
  console.info(`EVENT\nMember Codes: ${memberCodes.toString()}`);

  return memberCodes;
};

/**
 * CardアプリからレコードIDとラベルIDを取得する
 * @param client
 * @param appId
 * @param data
 */
export const getRecordIdAndLabelIdsFromCard = async (
  client: KintoneRestAPIClient,
  appId: string,
  data: Data
): Promise<{ recordId: string; tableIds: string[] } | undefined> => {
  const cardId = data.card.id;
  const res = await client.record.getRecords({
    app: appId,
    fields: ["$id", CardApp.labelTable],
    query: `${CardApp.id}="${cardId}"`,
  });
  if (res.records.length === 0) {
    return undefined;
  }
  const recordId =
    res.records[0].$id.value !== null
      ? res.records[0].$id.value.toString()
      : "";
  const labels = res.records[0][CardApp.labelTable].value as Array<{
    id: string;
  }>;
  const tableIds = labels.map((x) => x.id);
  console.info(
    `EVENT\nRecord ID: ${recordId}\nTable IDs: ${tableIds.toString()}`
  );

  return { recordId, tableIds };
};

export const addMember = async (
  client: KintoneRestAPIClient,
  appId: string,
  data: Data,
  kintoneUserId: string
) => {
  const memberId = data.member.id;
  const memberName = data.member.name;
  const addRecordParam = {
    app: appId,
    record: {
      [MemberApp.trelloId]: {
        value: memberId,
      },
      [MemberApp.name]: {
        value: memberName,
      },
      [MemberApp.kintoneUser]: {
        value: [
          {
            code: kintoneUserId,
          },
        ],
      },
    },
  };
  await client.record.addRecord(addRecordParam).then((event) => {
    console.info("EVENT\n" + event.id, event.revision);
  });

  return addRecordParam;
};

export const createCard = async (
  client: KintoneRestAPIClient,
  appId: string,
  data: Data
) => {
  const addRecordParam = {
    app: appId,
    record: {
      [CardApp.name]: {
        value: data.card.text,
      },
      [CardApp.id]: {
        value: data.card.id,
      },
      [CardApp.link]: {
        value: `https://trello.com/c/${data.card.shortLink}`,
      },
    },
  };
  if (Object.prototype.hasOwnProperty.call(data, "list")) {
    addRecordParam.record[CardApp.idList] = {
      value: (data.list as ListShort).id,
    };
  }

  await client.record.addRecord(addRecordParam).then((event) => {
    console.info("EVENT\n" + event.id, event.revision);
  });

  return addRecordParam;
};

export const updateCard = async (
  client: KintoneRestAPIClient,
  appId: string,
  data: Data,
  recordId: string
) => {
  const record: {
    [key: string]: { value: any };
  } = {};
  for (const [key] of Object.entries(data.old)) {
    record[CardApp[key]] = { value: data.card[key] };
  }

  await client.record
    .updateRecord({
      app: appId,
      id: recordId,
      record: record,
    })
    .then((event) => {
      console.info(`EVENT\nRevision: ${event.revision}`);
    });

  return record;
};

export const updateList = async (
  client: KintoneRestAPIClient,
  appId: string,
  data: Data,
  recordId: string
) => {
  const record: { [key: string]: { value: any } } = {};
  for (const [key] of Object.entries(data.old)) {
    record[ListApp[key]] = {
      value: (data.list as ListShort)[key],
    };
  }
  await client.record
    .updateRecord({
      app: appId,
      id: recordId,
      record: record,
    })
    .then((event) => {
      console.info(`EVENT\nRevision: ${event.revision}`);
    });
  return record;
};

export const createList = async (
  client: KintoneRestAPIClient,
  appId: string,
  data: Data
) => {
  const listValue = typeof data.list === "object" ? data.list : data.listAfter;
  const params = {
    app: appId,
    record: {
      NAME: {
        value: listValue?.name,
      },
      ID: {
        value: listValue?.id,
      },
    },
  };
  await client.record.addRecord(params).then((event) => {
    console.info("EVENT\n" + event.id, event.revision);
  });

  return params;
};

export const createLabel = async (
  client: KintoneRestAPIClient,
  appId: string,
  data: Data
) => {
  const params = {
    app: appId,
    record: {
      [LabelApp.id]: {
        value: data.label.id,
      },
      [LabelApp.name]: {
        value: data.label.name,
      },
      [LabelApp.color]: {
        value: data.label.color,
      },
    },
  };
  await client.record.addRecord(params).then((event) => {
    console.info("EVENT\n" + event.id, event.revision);
  });
  return params;
};

export const updateLabel = async (
  client: KintoneRestAPIClient,
  appId: string,
  data: Data,
  sameLabelId: string
) => {
  const params = {
    app: appId,
    id: sameLabelId,
    record: {
      [LabelApp.name]: {
        value: data.label.name,
      },
      [LabelApp.color]: {
        value: data.label.color,
      },
    },
  };
  await client.record.updateRecord(params).then((event) => {
    console.info(`EVENT\nRevision: ${event.revision}`);
  });

  return params;
};

export const addLabelToCard = async (
  client: KintoneRestAPIClient,
  appId: string,
  data: Data,
  recordId: string,
  tableIds: string[]
) => {
  const tableRecords: any[] = tableIds.map((id) => {
    return {
      id: id.toString(),
    };
  });
  tableRecords.push({
    value: {
      [CardApp.labelId]: data.label.id,
    },
  });
  const params = {
    app: appId,
    id: recordId,
    record: {
      [CardApp.labelTable]: {
        value: tableRecords,
      },
    },
  };
  await client.record.updateRecord(params);

  return params;
};

export const addMemberToCard = async (
  client: KintoneRestAPIClient,
  appId: string,
  cardID: string,
  kintoneUserCode: string,
  kintoneUserCodesOfSetted: string[]
) => {
  const memberCodesWithJSON: any[] = kintoneUserCodesOfSetted.map((code) => {
    return {
      code: code.toString(),
    };
  });
  memberCodesWithJSON.push({
    code: kintoneUserCode,
  });
  const params = {
    app: appId,
    id: cardID,
    record: {
      [CardApp.member]: {
        value: memberCodesWithJSON,
      },
    },
  };
  await client.record.updateRecord(params);
  return params;
};

export const removeMemberFromCard = async (
  client: KintoneRestAPIClient,
  appId: string,
  cardID: string,
  kintoneUserCode: string,
  kintoneUserCodesOfSetted: string[]
) => {
  const memberCodesWithJSON: any[] = kintoneUserCodesOfSetted
    .filter((code) => code.toString() !== kintoneUserCode)
    .map((code) => {
      return {
        code: code.toString(),
      };
    });
  const params = {
    app: appId,
    id: cardID,
    record: {
      [CardApp.member]: {
        value: memberCodesWithJSON,
      },
    },
  };
  await client.record.updateRecord(params);
  return params;
};
