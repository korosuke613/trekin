export class ActionType {
  static readonly CREATE_CARD = "createCard";
  static readonly UPDATE_CARD = "updateCard";
  static readonly COPY_CARD = "copyCard";
  static readonly CREATE_LIST = "createList";
  static readonly UPDATE_LIST = "updateList";
  static readonly CREATE_LABEL = "createLabel";
  static readonly UPDATE_LABEL = "updateLabel";
  static readonly ADD_LABEL_TO_CARD = "addLabelToCard";
  static readonly ADD_MEMBER_TO_CARD = "addMemberToCard";
  static readonly REMOVE_MEMBER_FROM_CARD = "removeMemberFromCard";
}

export interface CardShort {
  [key: string]: string | number | Date;
  id: string;
  name: string;
  desc: string;
  due: Date;
  dueReminder: number;
  idShort: number;
  idList: string;
  shortLink: string;
}

export interface ListShort {
  [key: string]: string;
  id: string;
  name: string;
}

export interface Board {
  id: string;
  name: string;
  shortLink: string;
}

export interface Data {
  card: CardShort | Card;
  list?: ListShort;
  listAfter?: ListShort;
  label: Label;
  board: Board;
  old: CardShort | ListShort;
  member: Member;
}

export interface Limits {}

export interface Card extends CardShort {
  type: string;
  text: string;
}

export interface List extends ListShort {
  type: string;
  text: string;
}

export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface Member {
  id: string;
  name: string;
}

export interface MemberCreatorShort {
  type: string;
  id: string;
  username: string;
  text: string;
}

export interface Entities {
  card: Card;
  list: List;
  memberCreator: MemberCreatorShort;
}

export interface Display {
  translationKey: string;
  entities: Entities;
}

export interface NonPublic {}

export interface MemberCreator extends MemberCreatorShort {
  activityBlocked: boolean;
  avatarHash: string;
  avatarUrl: string;
  fullName: string;
  idMemberReferrer: string;
  initials: string;
  nonPublic: NonPublic;
  nonPublicAvailable: boolean;
}

export interface Action {
  id: string;
  idMemberCreator: string;
  data: Data;
  type: string;
  date: Date;
  limits: Limits;
  display: Display;
  memberCreator: MemberCreator;
}

export interface RootObject {
  action: Action;
}
