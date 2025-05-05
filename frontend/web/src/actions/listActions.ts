import { Dispatch } from "react";
import { energyxList } from "../models";
import { ListService } from "../services/listService";
import { ActionTypes } from "./common";
import config from "../config"
import { trackEvent } from "../services/telemetryService";
import { ActionMethod, createPayloadAction, PayloadAction } from "./actionCreators";
import { QueryOptions } from "./itemActions";

const listService = new ListService(config.api.baseUrl, '/lists');

export interface ListActions {
    list(options?: QueryOptions): Promise<energyxList[]>
    load(id: string): Promise<energyxList>
    select(list: energyxList): Promise<energyxList>
    save(list: energyxList): Promise<energyxList>
    remove(id: string): Promise<void>
}

export const list = (options?: QueryOptions): ActionMethod<energyxList[]> => async (dispatch: Dispatch<ListListsAction>) => {
    const lists = await listService.getList(options);

    dispatch(listListsAction(lists));

    return lists;
}

export const select = (list: energyxList): ActionMethod<energyxList> => (dispatch: Dispatch<SelectListAction>) => {
    dispatch(selectListAction(list));

    return Promise.resolve(list);
}

export const load = (id: string): ActionMethod<energyxList> => async (dispatch: Dispatch<LoadListAction>) => {
    const list = await listService.get(id);

    dispatch(loadListAction(list));

    return list;
}

export const save = (list: energyxList): ActionMethod<energyxList> => async (dispatch: Dispatch<SaveListAction>) => {
    const newList = await listService.save(list);

    dispatch(saveListAction(newList));

    trackEvent(ActionTypes.SAVE_energyx_LIST.toString());

    return newList;
}

export const remove = (id: string): ActionMethod<void> => async (dispatch: Dispatch<DeleteListAction>) => {
    await listService.delete(id);

    dispatch(deleteListAction(id));
}

export interface ListListsAction extends PayloadAction<string, energyxList[]> {
    type: ActionTypes.LOAD_energyx_LISTS
}

export interface SelectListAction extends PayloadAction<string, energyxList | undefined> {
    type: ActionTypes.SELECT_energyx_LIST
}

export interface LoadListAction extends PayloadAction<string, energyxList> {
    type: ActionTypes.LOAD_energyx_LIST
}

export interface SaveListAction extends PayloadAction<string, energyxList> {
    type: ActionTypes.SAVE_energyx_LIST
}

export interface DeleteListAction extends PayloadAction<string, string> {
    type: ActionTypes.DELETE_energyx_LIST
}

const listListsAction = createPayloadAction<ListListsAction>(ActionTypes.LOAD_energyx_LISTS);
const selectListAction = createPayloadAction<SelectListAction>(ActionTypes.SELECT_energyx_LIST);
const loadListAction = createPayloadAction<LoadListAction>(ActionTypes.LOAD_energyx_LIST);
const saveListAction = createPayloadAction<SaveListAction>(ActionTypes.SAVE_energyx_LIST);
const deleteListAction = createPayloadAction<DeleteListAction>(ActionTypes.DELETE_energyx_LIST);
