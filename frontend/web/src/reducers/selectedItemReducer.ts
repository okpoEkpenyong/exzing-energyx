import { Reducer } from "react";
import { ActionTypes, energyxActions } from "../actions/common";
import { energyxItem } from "../models"

export const selectedItemReducer: Reducer<energyxItem | undefined, energyxActions> = (state: energyxItem | undefined, action: energyxActions): energyxItem | undefined => {
    switch (action.type) {
        case ActionTypes.SELECT_energyx_ITEM:
        case ActionTypes.LOAD_energyx_ITEM:
            state = action.payload ? { ...action.payload } : undefined;
            break;
        case ActionTypes.LOAD_energyx_LIST:
            state = undefined;
            break;
        case ActionTypes.DELETE_energyx_ITEM:
            if (state && state.id === action.payload) {
                state = undefined;
            }
    }

    return state;
}