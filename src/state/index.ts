import { configureStore } from "@reduxjs/toolkit";
import { AppSlice } from "./app";
import { DataSlice } from "./data";

export const CapybaraStore = configureStore({
    reducer: {
        app: AppSlice.reducer,
        data: DataSlice.reducer,
    },
});

export type CapybaraState = ReturnType<typeof CapybaraStore["getState"]>;
export const CapybaraDispatch = CapybaraStore.dispatch;
