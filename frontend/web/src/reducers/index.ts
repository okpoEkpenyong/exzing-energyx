import { Reducer } from "react";
import { EnergyxActions } from "../actions/common";
import { listsReducer } from "./listsReducer";
import { selectedItemReducer } from "./selectedItemReducer";
import { selectedListReducer } from "./selectedListReducer";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const combineReducers = (slices: {[key: string]: Reducer<any, EnergyxActions>}) => (prevState: any, action: EnergyxActions) =>
    Object.keys(slices).reduce(
        (nextState, nextProp) => ({
            ...nextState,
            [nextProp]: slices[nextProp](prevState[nextProp], action)
        }),
        prevState
    );

export default combineReducers({
    lists: listsReducer,
    selectedList: selectedListReducer,
    selectedItem: selectedItemReducer,
});
