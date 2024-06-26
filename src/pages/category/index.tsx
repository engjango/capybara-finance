import styled from "@emotion/styled";
import { FormControlLabel, Switch } from "@mui/material";
import { useMemo } from "react";
import { Page, SECTION_MARGIN } from "../../components/layout";
import { TransactionsTable } from "../../components/table";
import {
    TransactionsTableFilters,
    TransactionsTableFixedDataState,
    TransactionsTableState,
} from "../../components/table/table/types";
import { CapybaraDispatch } from "../../state";
import { AppSlice } from "../../state/app";
import { useCategoryPageCategory, useCategoryPageState } from "../../state/app/hooks";
import { useAllCategories } from "../../state/data/hooks";
import { CategoryPageBudgetSummary } from "./budget";
import { CategoryPageHeader } from "./header";
import { CategoryPageHistory } from "./history";

const MiddleBox = styled("div")({
    display: "flex",
    "& > div:first-of-type": {
        flex: "2 0 700px",
        marginRight: SECTION_MARGIN,
    },
    "& > div:last-child": {
        flex: "1 1 300px",
    },
});

export const CategoryPage: React.FC = () => {
    const category = useCategoryPageCategory();
    const table = useCategoryPageState((state) => state.table);

    const id = category?.id ?? -1; // Continue hooks in case Account is deleted while on page
    const hasChildren = useAllCategories().some(({ hierarchy }) => hierarchy.includes(id));

    // "table" is only undefined when redirecting to AccountsPage after deletion
    const fixed: TransactionsTableFixedDataState = useMemo(
        () => ({ type: "category", category: id, nested: table?.nested && hasChildren }),
        [id, table?.nested, hasChildren]
    );

    // In case Category is deleted while on page
    if (!category) {
        CapybaraDispatch(AppSlice.actions.setPage("categories"));
        return <Page title="Categories" />;
    }

    return (
        <Page title="Categories">
            <CategoryPageHeader />
            <div style={{height: "36px", width: "36px"}}/>
            <MiddleBox>
                <CategoryPageHistory />
                <CategoryPageBudgetSummary />
            </MiddleBox>
            <div style={{height: "36px", width: "36px"}}/>
            <TransactionsTable
                filters={table.filters}
                state={table.state}
                setFilters={setFilters}
                setState={setState}
                fixed={fixed}
                headers={
                    hasChildren ? (
                        <FormControlLabel
                            control={<Switch checked={table.nested} onChange={handleToggle} />}
                            label="Include Subcategories"
                        />
                    ) : undefined
                }
            />
        </Page>
    );
};

const setFilters = (filters: TransactionsTableFilters) =>
    CapybaraDispatch(AppSlice.actions.setCategoryTableStatePartial({ filters }));

const setState = (state: TransactionsTableState) =>
    CapybaraDispatch(AppSlice.actions.setCategoryTableStatePartial({ state }));

const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) =>
    CapybaraDispatch(AppSlice.actions.setCategoryTableStatePartial({ nested: event.target.checked }));
