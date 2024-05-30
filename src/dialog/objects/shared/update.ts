import { cloneDeep } from "lodash";
import { CapybaraDispatch, CapybaraStore } from "../../../state";
import { AppSlice } from "../../../state/app";
import { DataSlice } from "../../../state/data";
import { BasicObjectName, BasicObjectType } from "../../../state/data/types";
import { ID } from "../../../state/shared/values";

export const getUpdateFunctions = <Type extends BasicObjectName>(type: Type) => {
    type Option = BasicObjectType[Type];

    const get = (id: ID) => CapybaraStore.getState().data[type].entities[Number(id)] as Option;
    const getWorkingCopy = () => cloneDeep(CapybaraStore.getState().app.dialog[type] as Option);
    const set = (option?: Option) => CapybaraDispatch(AppSlice.actions.setDialogPartial({ id: type, [type]: option }));
    const setPartial = (partial?: Partial<Option>) =>
        set({ ...(CapybaraStore.getState().app.dialog[type]! as Option), ...partial });
    const remove = () => set();
    const update =
        <K extends keyof Option>(key: K) =>
        (value: Option[K]) =>
            setPartial({ [key]: value } as any);

    // Delete is a JS keyword
    const destroy = (id: ID) => {
        remove();
        CapybaraDispatch(DataSlice.actions.deleteObject({ type, id }));
    };

    const save = (working: Option) => {
        CapybaraDispatch(DataSlice.actions.saveObject({ type, working }));
        // Sometimes calculated properties can change in saveObject - this updates the working state
        CapybaraDispatch(AppSlice.actions.setDialogPartial({ [type]: get(working.id) }));
    };

    return { get, getWorkingCopy, set, setPartial, remove, update, destroy, save };
};
