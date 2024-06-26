import { mapValues } from "lodash";
import React from "react";
import { AppSlice, DefaultPages, getPagePathForPageState } from ".";
import { CapybaraDispatch } from "..";
import { PageStateType } from "./pageTypes";

export const OpenPageCache = mapValues(
    DefaultPages,
    (page) => (event: React.MouseEvent<HTMLButtonElement>) => openNewPage(DefaultPages[page.id], event)
);

export const openNewPage = (state: PageStateType, event: React.MouseEvent) => {
    if (event.metaKey) {
        window.open(getPagePathForPageState(state), "_blank");
    } else {
        CapybaraDispatch(AppSlice.actions.setPageState(state));
    }
};
