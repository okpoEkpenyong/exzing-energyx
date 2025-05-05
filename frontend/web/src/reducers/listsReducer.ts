import { Reducer } from "react";
import { ActionTypes, EnergyxActions } from "../actions/common";
import { EnergyxList } from "../models";

export const listsReducer: Reducer<EnergyxList[], EnergyxActions> = (state: EnergyxList[], action: EnergyxActions): EnergyxList[] => {
    switch (action.type) {
        case ActionTypes.LOAD_energyx_LISTS:
            state = [...action.payload];
            break;
        case ActionTypes.SAVE_energyx_LIST:
            state = [...state, action.payload];
            break;
        case ActionTypes.DELETE_energyx_LIST:
            state = [...state.filter(list => list.id !== action.payload)]
    }

    return state;
}