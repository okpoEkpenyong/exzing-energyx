import { Reducer } from "react";
import { ActionTypes, energyxActions } from "../actions/common";
import { energyxList } from "../models"

export const listsReducer: Reducer<energyxList[], energyxActions> = (state: energyxList[], action: energyxActions): energyxList[] => {
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