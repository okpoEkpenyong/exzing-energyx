import { Dispatch } from "react";
import { energyxItem } from "../models";
import { ItemService } from "../services/itemService";
import { ActionTypes } from "./common";
import config from "../config"
import { ActionMethod, createPayloadAction, PayloadAction } from "./actionCreators";

export interface QueryOptions {
    [key: string]: RegExp | boolean
}

export interface ItemActions {
    list(listId: string, options?: QueryOptions): Promise<energyxItem[]>
    select(item?: energyxItem): Promise<energyxItem>
    load(listId: string, id: string): Promise<energyxItem>
    save(listId: string, Item: energyxItem): Promise<energyxItem>
    remove(listId: string, Item: energyxItem): Promise<void>
}

export const list = (listId: string, options?: QueryOptions): ActionMethod<energyxItem[]> => async (dispatch: Dispatch<ListItemsAction>) => {
    const itemService = new ItemService(config.api.baseUrl, `/lists/${listId}/items`);
    const items = await itemService.getList(options);

    dispatch(listItemsAction(items));

    return items;
}

export const select = (item?: energyxItem): ActionMethod<energyxItem | undefined> => async (dispatch: Dispatch<SelectItemAction>) => {
    dispatch(selectItemAction(item));

    return Promise.resolve(item);
}

export const load = (listId: string, id: string): ActionMethod<energyxItem> => async (dispatch: Dispatch<LoadItemAction>) => {
    const itemService = new ItemService(config.api.baseUrl, `/lists/${listId}/items`);
    const item = await itemService.get(id);

    dispatch(loadItemAction(item));

    return item;
}

export const save = (listId: string, item: energyxItem): ActionMethod<energyxItem> => async (dispatch: Dispatch<SaveItemAction>) => {
    const itemService = new ItemService(config.api.baseUrl, `/lists/${listId}/items`);
    const newItem = await itemService.save(item);

    dispatch(saveItemAction(newItem));

    return newItem;
}

export const remove = (listId: string, item: energyxItem): ActionMethod<void> => async (dispatch: Dispatch<DeleteItemAction>) => {
    const itemService = new ItemService(config.api.baseUrl, `/lists/${listId}/items`);
    if (item.id) {
        await itemService.delete(item.id);
        dispatch(deleteItemAction(item.id));
    }
}

export interface ListItemsAction extends PayloadAction<string, energyxItem[]> {
    type: ActionTypes.LOAD_energyx_ITEMS
}

export interface SelectItemAction extends PayloadAction<string, energyxItem | undefined> {
    type: ActionTypes.SELECT_energyx_ITEM
}

export interface LoadItemAction extends PayloadAction<string, energyxItem> {
    type: ActionTypes.LOAD_energyx_ITEM
}

export interface SaveItemAction extends PayloadAction<string, energyxItem> {
    type: ActionTypes.SAVE_energyx_ITEM
}

export interface DeleteItemAction extends PayloadAction<string, string> {
    type: ActionTypes.DELETE_energyx_ITEM
}

const listItemsAction = createPayloadAction<ListItemsAction>(ActionTypes.LOAD_energyx_ITEMS);
const selectItemAction = createPayloadAction<SelectItemAction>(ActionTypes.SELECT_energyx_ITEM);
const loadItemAction = createPayloadAction<LoadItemAction>(ActionTypes.LOAD_energyx_ITEM);
const saveItemAction = createPayloadAction<SaveItemAction>(ActionTypes.SAVE_energyx_ITEM);
const deleteItemAction = createPayloadAction<DeleteItemAction>(ActionTypes.DELETE_energyx_ITEM);
