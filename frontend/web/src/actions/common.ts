import * as itemActions from './itemActions';
import * as listActions from './listActions';

export enum ActionTypes {
    LOAD_energyx_LISTS = "LOAD_energyx_LISTS",
    LOAD_energyx_LIST = "LOAD_energyx_LIST",
    SELECT_energyx_LIST = "SELECT_energyx_LIST",
    SAVE_energyx_LIST = "SAVE_energyx_LIST",
    DELETE_energyx_LIST = "DELETE_energyx_LIST",
    LOAD_energyx_ITEMS = "LOAD_energyx_ITEMS",
    LOAD_energyx_ITEM = "LOAD_energyx_ITEM",
    SELECT_energyx_ITEM = "SELECT_energyx_ITEM",
    SAVE_energyx_ITEM = "SAVE_energyx_ITEM",
    DELETE_energyx_ITEM = "DELETE_energyx_ITEM"
}

export type EnergyxActions =
    itemActions.ListItemsAction |
    itemActions.SelectItemAction |
    itemActions.LoadItemAction |
    itemActions.SaveItemAction |
    itemActions.DeleteItemAction |
    listActions.ListListsAction |
    listActions.SelectListAction |
    listActions.LoadListAction |
    listActions.SaveListAction |
    listActions.DeleteListAction;