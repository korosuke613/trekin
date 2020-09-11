import { Action, ActionType } from "./Trello";
import { Apps } from "./Kintone";
import { KintoneClientCreator } from "./KintoneClientCreator";
import { ApiExecutor } from "./ApiExecutor";
import { KintoneRestAPIClient } from "@kintone/rest-api-client";

export class Worker {
  public trelloAction: Action;
  private readonly kintoneClientCreator: KintoneClientCreator;
  private readonly apps: Apps;

  constructor(apps: Apps) {
    this.kintoneClientCreator = new KintoneClientCreator(apps.baseUrl);
    this.apps = apps;
    this.trelloAction = {} as Action;
  }

  public async action(
    trelloAction: Action
  ): Promise<
    | {
        app: string;
        id?: string;
        record: { [key: string]: { value: string | string[] | undefined } };
      }
    | { [key: string]: { value: string } }
  > {
    this.trelloAction = trelloAction;

    switch (this.trelloAction.type) {
      case ActionType.CREATE_CARD: {
        return this.createCard();
      }
      case ActionType.UPDATE_CARD: {
        return this.updateCard();
      }
      case ActionType.COPY_CARD: {
        return this.copyCard();
      }
      case ActionType.CREATE_LIST: {
        return this.createList();
      }
      case ActionType.UPDATE_LIST: {
        return this.updateList();
      }
      case ActionType.CREATE_LABEL: {
        return this.createLabel();
      }
      case ActionType.UPDATE_LABEL: {
        return this.updateLabel();
      }
      case ActionType.ADD_LABEL_TO_CARD: {
        return this.addLabelToCard();
      }
      case ActionType.ADD_MEMBER_TO_CARD: {
        return this.addMemberToCard();
      }
      case ActionType.REMOVE_MEMBER_FROM_CARD: {
        return this.removeMemberFromCard();
      }
    }

    return Promise.resolve({ app: "", record: {} });
  }

  async getCardRecordIdIfNotExistsCreateCard(client: KintoneRestAPIClient) {
    let cardRecordId = await ApiExecutor.getRecordIdFromCard(
      client,
      this.apps.cards.id,
      this.trelloAction.data
    );
    if (cardRecordId === undefined) {
      await ApiExecutor.createCard(
        client,
        this.apps.cards.id,
        this.trelloAction.data
      );
      cardRecordId = await ApiExecutor.getRecordIdFromCard(
        client,
        this.apps.cards.id,
        this.trelloAction.data
      );
    }
    return cardRecordId;
  }

  async getKintoneUserCodeIfNotExistsAddMember(client: KintoneRestAPIClient) {
    const kintoneUserCode = await ApiExecutor.getKintoneUserCode(
      client,
      this.apps.members.id,
      this.trelloAction.data
    );
    if (kintoneUserCode === undefined) {
      await ApiExecutor.addMember(
        client,
        this.apps.members.id,
        this.trelloAction.data,
        this.apps.defaultKintoneUserCode
      );
      return this.apps.defaultKintoneUserCode;
    }
    return kintoneUserCode;
  }

  async createCard() {
    const client = await this.kintoneClientCreator.createKintoneClient([
      this.apps.cards.token,
      this.apps.lists.token,
    ]);
    return ApiExecutor.createCard(
      client,
      this.apps.cards.id,
      this.trelloAction.data
    );
  }

  async updateCard() {
    const client = await this.kintoneClientCreator.createKintoneClient([
      this.apps.cards.token,
      this.apps.lists.token,
    ]);
    if (
      Object.prototype.hasOwnProperty.call("card", "idList") ||
      Object.prototype.hasOwnProperty.call("data", "list")
    ) {
      const listRecordId = await ApiExecutor.getRecordIdFromList(
        client,
        this.apps.lists.id,
        this.trelloAction.data
      );
      console.log(listRecordId);
      if (listRecordId === undefined)
        await ApiExecutor.createList(
          client,
          this.apps.lists.id,
          this.trelloAction.data
        );
    }
    const cardRecordId = await this.getCardRecordIdIfNotExistsCreateCard(
      client
    );
    return ApiExecutor.updateCard(
      client,
      this.apps.cards.id,
      this.trelloAction.data,
      cardRecordId as string
    );
  }
  async copyCard() {
    const client = await this.kintoneClientCreator.createKintoneClient([
      this.apps.cards.token,
      this.apps.lists.token,
    ]);
    return ApiExecutor.createCard(
      client,
      this.apps.cards.id,
      this.trelloAction.data
    );
  }
  async createList() {
    const client = await this.kintoneClientCreator.createKintoneClient(
      this.apps.lists.token
    );
    return ApiExecutor.createList(
      client,
      this.apps.lists.id,
      this.trelloAction.data
    );
  }
  async updateList() {
    const client = await this.kintoneClientCreator.createKintoneClient(
      this.apps.lists.token
    );
    let listRecordId = await ApiExecutor.getRecordIdFromList(
      client,
      this.apps.lists.id,
      this.trelloAction.data
    );
    if (listRecordId === undefined) {
      await ApiExecutor.createList(
        client,
        this.apps.lists.id,
        this.trelloAction.data
      );
      listRecordId = await ApiExecutor.getRecordIdFromList(
        client,
        this.apps.lists.id,
        this.trelloAction.data
      );
    }
    return ApiExecutor.updateList(
      client,
      this.apps.lists.id,
      this.trelloAction.data,
      listRecordId as string
    );
  }
  async createLabel() {
    const client = await this.kintoneClientCreator.createKintoneClient(
      this.apps.labels.token
    );
    return ApiExecutor.createLabel(
      client,
      this.apps.labels.id,
      this.trelloAction.data
    );
  }
  async updateLabel() {
    const client = await this.kintoneClientCreator.createKintoneClient(
      this.apps.labels.token
    );
    const sameLabelId = await ApiExecutor.getRecordIdFromLabelOfSame(
      client,
      this.apps.labels.id,
      this.trelloAction.data
    );
    if (sameLabelId === undefined) {
      return ApiExecutor.createLabel(
        client,
        this.apps.labels.id,
        this.trelloAction.data
      );
    }
    return ApiExecutor.updateLabel(
      client,
      this.apps.labels.id,
      this.trelloAction.data,
      sameLabelId
    );
  }

  async addLabelToCard() {
    const client = await this.kintoneClientCreator.createKintoneClient([
      this.apps.cards.token,
      this.apps.labels.token,
    ]);
    const cardInfo = await ApiExecutor.getRecordIdAndLabelIdsFromCard(
      client,
      this.apps.cards.id,
      this.trelloAction.data
    );
    if (cardInfo === undefined) {
      throw new Error("Card is no such exists");
    }
    const labelRecordId = await ApiExecutor.getRecordIdFromLabelOfSame(
      client,
      this.apps.labels.id,
      this.trelloAction.data
    );
    if (labelRecordId === undefined) {
      return ApiExecutor.createLabel(
        client,
        this.apps.labels.id,
        this.trelloAction.data
      );
    }
    return ApiExecutor.addLabelToCard(
      client,
      this.apps.cards.id,
      this.trelloAction.data,
      cardInfo.recordId,
      cardInfo.tableIds
    );
  }

  async addMemberToCard() {
    const client = await this.kintoneClientCreator.createKintoneClient([
      this.apps.members.token,
      this.apps.cards.token,
    ]);
    const recordId = await this.getCardRecordIdIfNotExistsCreateCard(client);
    const kintoneUserCode = await this.getKintoneUserCodeIfNotExistsAddMember(
      client
    );
    const kintoneUserCodesOfSetted = await ApiExecutor.getKintoneUserCodesOfSetted(
      client,
      this.apps.cards.id,
      this.trelloAction.data
    );
    return ApiExecutor.addMemberToCard(
      client,
      this.apps.cards.id,
      recordId as string,
      kintoneUserCode,
      kintoneUserCodesOfSetted
    );
  }

  async removeMemberFromCard() {
    const client = await this.kintoneClientCreator.createKintoneClient([
      this.apps.members.token,
      this.apps.cards.token,
    ]);
    const recordId = await this.getCardRecordIdIfNotExistsCreateCard(client);
    const kintoneUserCode = await this.getKintoneUserCodeIfNotExistsAddMember(
      client
    );
    const kintoneUserCodesOfSetted = await ApiExecutor.getKintoneUserCodesOfSetted(
      client,
      this.apps.cards.id,
      this.trelloAction.data
    );
    return ApiExecutor.removeMemberFromCard(
      client,
      this.apps.cards.id,
      recordId as string,
      kintoneUserCode,
      kintoneUserCodesOfSetted
    );
  }
}
