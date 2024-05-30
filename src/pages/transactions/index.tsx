import React from "react";
import { Page } from "../../components/layout";
import { TransactionsTable } from "../../components/table";
import { TransactionsTableFilters, TransactionsTableState } from "../../components/table/table/types";
import { CapybaraDispatch } from "../../state";
import { AppSlice } from "../../state/app";
import { useTransactionsPageState } from "../../state/app/hooks";
import { TransactionsPageSummary } from "./summary";
import { useLanguage } from "../../languages/languages-context";

export const TransactionsPage: React.FC = () => {
    const { filters, state } = useTransactionsPageState((state) => state.table);
    const { language, translations } = useLanguage();
    return (
        <Page title={ translations[language].transactions }>
            <TransactionsPageSummary />
            <div style={{height: "36px", width: "36px"}}/>
            <TransactionsTable filters={filters} state={state} setFilters={setFilters} setState={setState} />
        </Page>
    );
};

const setFilters = (filters: TransactionsTableFilters) =>
    CapybaraDispatch(AppSlice.actions.setTransactionsTablePartial({ filters }));

const setState = (state: TransactionsTableState) =>
    CapybaraDispatch(AppSlice.actions.setTransactionsTablePartial({ state }));
