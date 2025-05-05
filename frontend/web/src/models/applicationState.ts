import { Dispatch } from "react";
import { EnergyxActions } from "../actions/common";
import { EnergyxItem } from "./energyxItem";
import { EnergyxList } from "./energyxList";

export interface AppContext {
    state: ApplicationState
    dispatch: Dispatch<EnergyxActions>
}

export interface ApplicationState {
    lists?: EnergyxList[]
    selectedList?: EnergyxList
    selectedItem?: EnergyxItem
}

export const getDefaultState = (): ApplicationState => {
    return {
        lists: undefined,
        selectedList: undefined,
        selectedItem: undefined
    }
}

