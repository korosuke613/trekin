import { CardApp, LabelApp, ListApp, MemberApp } from "./Kintone";
import { Data, Entities, ListShort } from "./Trello";
import { KintoneRestAPIClient } from "@kintone/rest-api-client";
const urlJoin = require("url-join");

/**
 * Cardアプリからtrelloのカードに一致するレコードIDを取得する
 * @param client
 * @param appId
 * @param data
 */
const getRecordIdFromCard = async (
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
  console.info(`getRecordIdFromCard\nCard record ID: ${recordId}`);

  return recordId;
};

/**
 * Listアプリからtrelloのリストに一致するレコードIDを取得する
 * @param client
 * @param appId
 * @param data
 */
const getRecordIdFromList = async (
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
  console.info(`getRecordIdFromList\nList record ID: ${recordId}`);

  return recordId;
};

/**
 * ラベルアプリからラベルのIDを取得する
 * @param client
 * @param appId
 * @param data
 */
const getRecordIdFromLabelOfSame = async (
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
  console.info(`getRecordIdFromLabelOfSame\nLabel record ID: ${recordId}`);

  return recordId;
};

/**
 * trelloのIDに紐づいてるkintoneのユーザコードを取得する
 * @param client
 * @param appId
 * @param data
 */
const getKintoneUserCode = async (
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
  console.info(`getKintoneUserCode\nkintone user code: ${kintoneUserCode}`);

  return kintoneUserCode;
};

/**
 * すでにアサインされているkintoneユーザのcodeを取得する
 * @param client
 * @param appId
 * @param data
 */
const getKintoneUserCodesOfSetted = async (
  client: KintoneRestAPIClient,
  appId: string,
  data: Data
): Promise<string[]> => {
  const cardId = data.card.id;
  const res = await client.record.getRecords({
    app: appId,
    fields: [CardApp.member],
    query: `${CardApp.id}="${cardId}"`,
  });
  if (res.records.length === 0) {
    return [];
  }
  const members = res.records[0][CardApp.member].value as Array<{
    code: string;
    name: string;
  }>;
  const memberCodes = members.map((x) => x.code);
  console.info(
    `getKintoneUserCodesOfSetted\nkintone user codes: ${memberCodes.toString()}`
  );

  return memberCodes;
};

/**
 * CardアプリからレコードIDとラベルIDを取得する
 * @param client
 * @param appId
 * @param data
 */
const getRecordIdAndLabelIdsFromCard = async (
  client: KintoneRestAPIClient,
  appId: string,
  data: Data
): Promise<
  | {
      recordId: string;
      tableIds: Array<{
        id: string;
        value: {
          [key: string]: any;
        };
      }>;
    }
  | undefined
> => {
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
    value: {
      [key: string]: any;
    };
  }>;
  const tableIds = labels.map((x) => {
    return {
      id: x.id,
      value: {
        LABEL_ID: x.value?.LABEL_ID,
        LABEL_NAME: x.value?.LABEL_NAME,
      },
    };
  });
  console.info(
    `getRecordIdAndLabelIdsFromCard\nCard record ID: ${recordId}\nCard with label table IDs: ${JSON.stringify(
      tableIds
    )}`
  );

  return { recordId, tableIds };
};

const addMember = async (
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
    console.info("addMember\n" + event.id, event.revision);
  });

  return addRecordParam;
};

const createCard = async (
  client: KintoneRestAPIClient,
  appId: string,
  data: Data
) => {
  const addRecordParam: {
    app: string;
    record: { [key: string]: { value: any } };
  } = {
    app: appId,
    record: {
      [CardApp.name]: {
        value: data.card.name,
      },
      [CardApp.id]: {
        value: data.card.id,
      },
      [CardApp.link]: {
        value: `https://trello.com/c/${data.card.shortLink}`,
      },
    },
  };
  for (const [key] of Object.entries(data.card)) {
    if (CardApp[key] === undefined) continue;
    addRecordParam.record[CardApp[key]] = { value: data.card[key] };
  }
  if (Object.prototype.hasOwnProperty.call(data, "list")) {
    addRecordParam.record[CardApp.idList] = {
      value: (data.list as ListShort).id,
    };
  }

  await client.record.addRecord(addRecordParam).then((event) => {
    console.info("createCard\n" + event.id, event.revision);
  });

  return addRecordParam;
};

const updateCard = async (
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
      console.info(`updateCard\nRevision: ${event.revision}`);
    });

  return record;
};

const updateList = async (
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
      console.info(`updateList\nRevision: ${event.revision}`);
    });
  return record;
};

const createList = async (
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
    console.info("createList\n" + event.id, event.revision);
  });

  return params;
};

const createLabel = async (
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
    console.info("createLabel\n" + event.id, event.revision);
  });
  return params;
};

const updateLabel = async (
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
    console.info(`updateLabel\nRevision: ${event.revision}`);
  });

  return params;
};

const addLabelToCard = async (
  client: KintoneRestAPIClient,
  appId: string,
  data: Data,
  recordId: string,
  tableIds: Array<{
    id: string;
    value: {
      [key: string]: any;
    };
  }>
) => {
  const tableRecords: any[] = tableIds.map((records) => {
    return {
      id: records.id.toString(),
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

const removeLabelFromCard = async (
  client: KintoneRestAPIClient,
  appId: string,
  data: Data,
  recordId: string,
  tableIds: Array<{
    id: string;
    value: {
      [key: string]: any;
    };
  }>
) => {
  const tableRecords: Array<{ id: string }> = tableIds
    .filter((record) => record.value.LABEL_ID.value !== data.label.id)
    .map((label) => {
      return {
        id: label.id.toString(),
      };
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

const addMemberToCard = async (
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

const removeMemberFromCard = async (
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

const commentCard = async (
  client: KintoneRestAPIClient,
  appId: string,
  entities: Entities,
  cardID: string
) => {
  const params = {
    app: appId,
    record: cardID,
    comment: {
      text: `${entities.memberCreator.username}:${entities.memberCreator.text}\n\n${entities.comment.text}`,
    },
  };
  await client.record.addRecordComment(params);
  return params;
};

export const registerRecordIdToTrello = async (
  id: string,
  baseUrl: string,
  cardAppId: string,
  trelloApiKey: string,
  trelloApiToken: string,
  eptreId: string
) => {
  const cardUrl = urlJoin(baseUrl, `/k/${cardAppId}/show#record=${eptreId}`);

  // This code sample uses the 'node-fetch' library:
  // https://www.npmjs.com/package/node-fetch
  const fetch = require("node-fetch");
  const fetchUrl = `https://api.trello.com/1/cards/${id}/attachments?key=${trelloApiKey}&token=${trelloApiToken}&name=EPTRE-${eptreId}&url=${encodeURIComponent(
    cardUrl
  )}`;
  console.log(fetchUrl);
  const fetchPromise = await fetch(fetchUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  });

  return {
    url: fetchPromise.url,
    status: fetchPromise.status,
    statusText: fetchPromise.statusText,
    text: await fetchPromise.text(),
  };
};

export const ApiExecutor = {
  createCard,
  updateCard,
  createLabel,
  updateLabel,
  createList,
  updateList,
  addMember,
  addLabelToCard,
  removeLabelFromCard,
  addMemberToCard,
  getRecordIdFromCard,
  getKintoneUserCode,
  getKintoneUserCodesOfSetted,
  getRecordIdAndLabelIdsFromCard,
  getRecordIdFromLabelOfSame,
  removeMemberFromCard,
  getRecordIdFromList,
  commentCard,
  registerRecordIdToTrello,
};
