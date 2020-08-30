interface App {
  id: string;
  token: string;
}

export interface Apps {
  cards: App;
  labels: App;
  members: App;
  lists: App;
  baseUrl: string;
  defaultKintoneUserCode: string;
}

interface AppFieldIDs {
  [key: string]: string;
}

export const CardApp: AppFieldIDs = {
  name: "NAME",
  id: "ID",
  desc: "DESC",
  link: "LINK",
  idList: "LIST_LOOK",
  labelTable: "LABEL_TABLE",
  labelId: "LABEL_ID",
  due: "DUE",
  dueReminder: "DUE_REMINDER",
  closed: "CLOSED",
  member: "USER",
};

export const ListApp: AppFieldIDs = {
  name: "NAME",
  id: "ID",
  closed: "CLOSED",
};

export const LabelApp: AppFieldIDs = {
  name: "NAME",
  id: "ID",
  color: "COLOR",
};

export const MemberApp: AppFieldIDs = {
  name: "NAME",
  trelloId: "TRELLO_ID",
  kintoneUser: "KINTONE_USER",
};
