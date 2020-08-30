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

  public async action(trelloAction: Action) {
    this.trelloAction = trelloAction;

    switch (this.trelloAction.type) {
      case ActionType.CREATE_CARD: {
        await this.createCard();
        break;
      }
      case ActionType.UPDATE_CARD: {
        await this.updateCard();
        break;
      }
      case ActionType.COPY_CARD: {
        await this.copyCard();
        break;
      }
      case ActionType.CREATE_LIST: {
        await this.createList();
        break;
      }
      case ActionType.UPDATE_LIST: {
        await this.updateList();
        break;
      }
      case ActionType.CREATE_LABEL: {
        await this.createLabel();
        break;
      }
      case ActionType.UPDATE_LABEL: {
        await this.updateLabel();
        break;
      }
      case ActionType.ADD_LABEL_TO_CARD: {
        await this.addLabelToCard();
        break;
      }
      case ActionType.ADD_MEMBER_TO_CARD: {
        await this.addMemberToCard();
        break;
      }
      case ActionType.REMOVE_MEMBER_FROM_CARD: {
        await this.removeMemberFromCard();
        break;
      }
    }
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
      this.apps.cards.id,
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
    await ApiExecutor.createCard(
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
    await ApiExecutor.updateCard(
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
    await ApiExecutor.createCard(
      client,
      this.apps.cards.id,
      this.trelloAction.data
    );
    const cardRecordId = await ApiExecutor.getRecordIdFromCard(
      client,
      this.apps.cards.id,
      this.trelloAction.data
    );
    await ApiExecutor.updateCard(
      client,
      this.apps.cards.id,
      this.trelloAction.data,
      cardRecordId as string
    );
  }
  async createList() {
    const client = await this.kintoneClientCreator.createKintoneClient(
      this.apps.lists.token
    );
    await ApiExecutor.createList(
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
    await ApiExecutor.updateList(
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
    await ApiExecutor.createLabel(
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
      await ApiExecutor.createLabel(
        client,
        this.apps.labels.id,
        this.trelloAction.data
      );
    } else {
      await ApiExecutor.updateLabel(
        client,
        this.apps.labels.id,
        this.trelloAction.data,
        sameLabelId
      );
    }
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
      await ApiExecutor.createLabel(
        client,
        this.apps.labels.id,
        this.trelloAction.data
      );
    }
    await ApiExecutor.addLabelToCard(
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
    if (kintoneUserCodesOfSetted)
      await ApiExecutor.addMemberToCard(
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
    await ApiExecutor.removeMemberFromCard(
      client,
      this.apps.cards.id,
      recordId as string,
      kintoneUserCode,
      kintoneUserCodesOfSetted
    );
  }
}
