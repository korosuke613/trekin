import {CardApp, LabelApp, ListApp, MemberApp} from "./AppFieldIDs";
import {Data} from "./Trello";
import {KintoneRestAPIClient} from "@kintone/rest-api-client";

/**
 * Cardアプリからtrelloのカードに一致するレコードIDを取得する
 * @param client
 * @param appId
 * @param data
 */
export const getRecordIdFromCard = async (client: KintoneRestAPIClient, appId: string, data: Data): Promise<string | undefined> => {
    const cardId = data.card.id
    const res = await client.record.getRecords({
        app: appId,
        fields: ["$id"],
        query: `${CardApp.id}="${cardId}"`
    })
    if (res.records.length === 0) {
        return undefined
    }
    const recordId = res.records[0]["$id"].value !== null ? res.records[0]["$id"].value.toString(): ""
    console.info(`EVENT\nRecord ID: ${recordId}`)

    return recordId
}

/**
 * Listアプリからtrelloのリストに一致するレコードIDを取得する
 * @param client
 * @param appId
 * @param data
 */
export const getRecordIdFromList = async (client: KintoneRestAPIClient, appId: string, data: Data): Promise<string | undefined> => {
    const listValue = typeof data.list === "object" ? data.list : data.listAfter

    if(listValue === undefined){
        return undefined
    }

    const res = await client.record.getRecords({
        app: appId,
        fields: ["$id"],
        query: `${ListApp.id}="${listValue.id}"`
    })
    if (res.records.length === 0) {
        return undefined
    }
    const recordId = res.records[0]["$id"].value !== null ? res.records[0]["$id"].value.toString(): ""
    console.info(`EVENT\nRecord ID: ${recordId}`)

    return recordId
}

/**
 * ラベルアプリからラベルのIDを取得する
 * @param client
 * @param appId
 * @param data
 */
export const getRecordIdFromLabelOfSame = async (client: KintoneRestAPIClient, appId: string, data: Data): Promise<string | undefined> => {
    const labelId = data.label.id
    const res = await client.record.getRecords({
        app: appId,
        fields: ["$id"],
        query: `${LabelApp.id}="${labelId}"`
    })
    if (res.records.length === 0) {
        return undefined
    }
    const recordId = res.records[0]["$id"].value !== null ? res.records[0]["$id"].value.toString(): ""
    console.info(`EVENT\nRecord ID: ${recordId}`)

    return recordId
}

/**
 * trelloのIDに紐づいてるkintoneのユーザコードを取得する
 * @param client
 * @param appId
 * @param data
 */
export const getKintoneUserCode = async (client: KintoneRestAPIClient, appId: string, data: Data): Promise<string | undefined> => {
    const memberId = data.member.id
    const res = await client.record.getRecords({
        app: appId,
        fields: [MemberApp.kintoneUser],
        query: `${MemberApp.trelloId}="${memberId}"`
    })
    if (res.records.length === 0) {
        return undefined
    }
    const kintoneUsers = res.records[0][MemberApp.kintoneUser].value as {code: string, name: string}[]
    const kintoneUser = kintoneUsers !== null ? kintoneUsers[0] as {code: string, name: string} : {code: "", name: ""}
    const kintoneUserCode = kintoneUser.code
    console.info(`EVENT\nKINTONE_USER: ${kintoneUserCode}`)

    return kintoneUserCode
}

/**
 * すでにアサインされているkintoneユーザのcodeを取得する
 * @param client
 * @param appId
 * @param data
 */
export const getKintoneUserCodesOfSetted = async (client: KintoneRestAPIClient, appId: string, data: Data): Promise<string[]|undefined> => {
    const cardId = data.card.id
    const res = await client.record.getRecords({
        app: appId,
        fields: [CardApp.member],
        query: `${CardApp.id}="${cardId}"`
    })
    if (res.records.length === 0) {
        return undefined
    }
    const members = res.records[0][CardApp.member].value as {code: string, name: string}[]
    const memberCodes = members.map(x => x.code)
    console.info(`EVENT\nMember Codes: ${memberCodes.toString()}`)

    return memberCodes
}




/**
 * CardアプリからレコードIDとラベルIDを取得する
 * @param client
 * @param appId
 * @param data
 */
export const getRecordIdAndLabelIdsFromCard = async (client: KintoneRestAPIClient, appId: string, data: Data): Promise<{ recordId: string, tableIds: Array<string> } | undefined> => {
    const cardId = data.card.id
    const res = await client.record.getRecords({
        app: appId,
        fields: ["$id", CardApp.labelTable],
        query: `${CardApp.id}="${cardId}"`
    })
    if(res.records.length === 0){
        return undefined
    }
    const recordId = res.records[0]["$id"].value !== null ? res.records[0]["$id"].value.toString(): ""
    const labels = res.records[0][CardApp.labelTable].value as {id: string}[]
    const tableIds = labels.map(x => x.id)
    console.info(`EVENT\nRecord ID: ${recordId}\nTable IDs: ${tableIds.toString()}`)

    return {recordId, tableIds}
}