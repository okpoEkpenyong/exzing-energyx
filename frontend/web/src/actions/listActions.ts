import { Dispatch } from "react";
import config from "../config";
import { EnergyxList } from "../models";
import { ListService } from "../services/listService";
import { trackEvent } from "../services/telemetryService";
import { ActionMethod, createPayloadAction, PayloadAction } from "./actionCreators";
import { ActionTypes } from "./common";
import { QueryOptions } from "./itemActions";

const listService = new ListService(config.api.baseUrl, '/lists');

export interface ListActions {
    list(options?: QueryOptions): Promise<EnergyxList[]>
    load(id: string): Promise<EnergyxList>
    select(list: EnergyxList): Promise<EnergyxList>
    save(list: EnergyxList): Promise<EnergyxList>
    remove(id: string): Promise<void>
}

export const list = (options?: QueryOptions): ActionMethod<EnergyxList[]> => async (dispatch: Dispatch<ListListsAction>) => {
    const lists = await listService.getList(options);

    dispatch(listListsAction(lists));

    return lists;
}

export const select = (list: EnergyxList): ActionMethod<EnergyxList> => (dispatch: Dispatch<SelectListAction>) => {
    dispatch(selectListAction(list));

    return Promise.resolve(list);
}

export const load = (id: string): ActionMethod<EnergyxList> => async (dispatch: Dispatch<LoadListAction>) => {
    const list = await listService.get(id);

    dispatch(loadListAction(list));

    return list;
}

export const save = (list: EnergyxList): ActionMethod<EnergyxList> => async (dispatch: Dispatch<SaveListAction>) => {
    const newList = await listService.save(list);

    dispatch(saveListAction(newList));

    trackEvent(ActionTypes.SAVE_energyx_LIST.toString());

    return newList;
}

export const remove = (id: string): ActionMethod<void> => async (dispatch: Dispatch<DeleteListAction>) => {
    await listService.delete(id);

    dispatch(deleteListAction(id));
}

export interface ListListsAction extends PayloadAction<string, EnergyxList[]> {
    type: ActionTypes.LOAD_energyx_LISTS
}

export interface SelectListAction extends PayloadAction<string, EnergyxList | undefined> {
    type: ActionTypes.SELECT_energyx_LIST
}

export interface LoadListAction extends PayloadAction<string, EnergyxList> {
    type: ActionTypes.LOAD_energyx_LIST
}

export interface SaveListAction extends PayloadAction<string, EnergyxList> {
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
