import { Dispatch } from "react";
import { energyxActions } from "../actions/common";
import { energyxItem } from "./energyxItem";
import { energyxList } from "./energyxList";

export interface AppContext {
    state: ApplicationState
    dispatch: Dispatch<energyxActions>
}

export interface ApplicationState {
    lists?: energyxList[]
    selectedList?: energyxList
    selectedItem?: energyxItem
}

export const getDefaultState = (): ApplicationState => {
    return {
        lists: undefined,
        selectedList: undefined,
        selectedItem: undefined
    }
}

