import { Dispatch } from "react";
import config from "../config";
import { EnergyxItem } from "../models";
import { ItemService } from "../services/itemService";
import { ActionMethod, createPayloadAction, PayloadAction } from "./actionCreators";
import { ActionTypes } from "./common";

export interface QueryOptions {
    [key: string]: RegExp | boolean
}

export interface ItemActions {
    list(listId: string, options?: QueryOptions): Promise<EnergyxItem[]>
    select(item?: EnergyxItem): Promise<EnergyxItem>
    load(listId: string, id: string): Promise<EnergyxItem>
    save(listId: string, Item: EnergyxItem): Promise<EnergyxItem>
    remove(listId: string, Item: EnergyxItem): Promise<void>
}

export const list = (listId: string, options?: QueryOptions): ActionMethod<EnergyxItem[]> => async (dispatch: Dispatch<ListItemsAction>) => {
    const itemService = new ItemService(config.api.baseUrl, `/lists/${listId}/items`);
    const items = await itemService.getList(options);

    dispatch(listItemsAction(items));

    return items;
}

export const select = (item?: EnergyxItem): ActionMethod<EnergyxItem | undefined> => async (dispatch: Dispatch<SelectItemAction>) => {
    dispatch(selectItemAction(item));

    return Promise.resolve(item);
}

export const load = (listId: string, id: string): ActionMethod<EnergyxItem> => async (dispatch: Dispatch<LoadItemAction>) => {
    const itemService = new ItemService(config.api.baseUrl, `/lists/${listId}/items`);
    const item = await itemService.get(id);

    dispatch(loadItemAction(item));

    return item;
}

export const save = (listId: string, item: EnergyxItem): ActionMethod<EnergyxItem> => async (dispatch: Dispatch<SaveItemAction>) => {
    const itemService = new ItemService(config.api.baseUrl, `/lists/${listId}/items`);
    const newItem = await itemService.save(item);

    dispatch(saveItemAction(newItem));

    return newItem;
}

export const remove = (listId: string, item: EnergyxItem): ActionMethod<void> => async (dispatch: Dispatch<DeleteItemAction>) => {
    const itemService = new ItemService(config.api.baseUrl, `/lists/${listId}/items`);
    if (item.id) {
        await itemService.delete(item.id);
        dispatch(deleteItemAction(item.id));
    }
}

export interface ListItemsAction extends PayloadAction<string, EnergyxItem[]> {
    type: ActionTypes.LOAD_energyx_ITEMS
}

export interface SelectItemAction extends PayloadAction<string, EnergyxItem | undefined> {
    type: ActionTypes.SELECT_energyx_ITEM
}

export interface LoadItemAction extends PayloadAction<string, EnergyxItem> {
    type: ActionTypes.LOAD_energyx_ITEM
}

export interface SaveItemAction extends PayloadAction<string, EnergyxItem> {
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
