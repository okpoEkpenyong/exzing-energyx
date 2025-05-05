import { Reducer } from "react";
import { ActionTypes, energyxActions } from "../actions/common";
import { energyxList } from "../models"

export const selectedListReducer: Reducer<energyxList | undefined, energyxActions> = (state: energyxList | undefined, action: energyxActions) => {
    switch (action.type) {
        case ActionTypes.SELECT_energyx_LIST:
        case ActionTypes.LOAD_energyx_LIST:
            state = action.payload ? { ...action.payload } : undefined;
            break;
        case ActionTypes.DELETE_energyx_LIST:
            if (state && state.id === action.payload) {
                state = undefined;
            }
            break;
        case ActionTypes.LOAD_energyx_ITEMS:
            if (state) {
                state.items = [...action.payload];
            }
            break;
        case ActionTypes.SAVE_energyx_ITEM:
            if (state) {
                const items = [...state.items || []];
                const index = items.findIndex(item => item.id === action.payload.id);
                if (index > -1) {
                    items.splice(index, 1, action.payload);
                    state.items = items;
                } else {
                    state.items = [...items, action.payload];
                }
            }
            break;
        case ActionTypes.DELETE_energyx_ITEM:
            if (state) {
                state.items = [...(state.items || []).filter(item => item.id !== action.payload)];
            }
            break;
    }

    return state;
}