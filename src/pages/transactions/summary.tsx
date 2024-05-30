import { MenuItem, Select } from "@mui/material";
import React from "react";
import { Section } from "../../components/layout";
import {
    SummaryBarChart,
    SummaryBreakdown,
    SummarySection,
    useTransactionsSummaryData,
} from "../../components/summary";
import { SummaryChartSign } from "../../components/summary/shared";
import { TransactionsTableFilters } from "../../components/table/table/types";
import { zipObject } from "../../shared/data";
import { handleSelectChange } from "../../shared/events";
import { CapybaraDispatch, CapybaraStore } from "../../state";
import { AppSlice } from "../../state/app";
import { useTransactionsPageState } from "../../state/app/hooks";
import { TransactionsPageAggregations, TransactionsPageState } from "../../state/app/pageTypes";
import { ID } from "../../state/shared/values";
import { useLanguage } from "../../languages/languages-context";

export const TransactionsPageSummary: React.FC = React.memo(() => {
    const aggregation = useTransactionsPageState((state) => state.chartAggregation);
    const sign = useTransactionsPageState((state) => state.chartSign);
    const { data, length } = useTransactionsSummaryData(aggregation);
    const { language, translations } = useLanguage();
    return (
        <SummarySection>
            <Section title = { translations[language].transactionsSummary } onClick = { clearFilter }>
                <SummaryBreakdown
                    data = { data }
                    sign = { sign }
                    creditsName = { translations[language].monthlyIncomes }
                    debitsName = { translations[language].monthlyExpenses }
                    help = { length === 25 ? translations[language].averageOverTwoYearsToLastMonth : translations[language].averageOverHistoryToLastMonth }
                    setFilter = { setFilterID[aggregation] }
                />
            </Section>
            <Section
                title=""
                headers={[
                    <Select value={aggregation} onChange={setAggregation} size="small" key="aggregation" style={{ color: "#fff", background: "#242020" }}>
                        <MenuItem value="account">{ translations[language].byAccount }</MenuItem>
                        <MenuItem value="category">{ translations[language].byCategory }</MenuItem>
                        <MenuItem value="currency">{ translations[language].ByCurrency }</MenuItem>
                    </Select>,
                    <Select value={sign} onChange={setChartSign} size="small" key="sign" style={{ color: "#fff", background: "#242020" }}>
                        <MenuItem value="all">{ translations[language].allTransactions }</MenuItem>
                        <MenuItem value="credits">{ translations[language].incomes }</MenuItem>
                        <MenuItem value="debits">{ translations[language].expenses }</MenuItem>
                    </Select>,
                ]}
                onClick={clearFilter}
            >
                <SummaryBarChart
                    series={data}
                    sign={sign}
                    setFilter={setFilterID[aggregation]}
                    id={aggregation + sign}
                />
            </Section>
        </SummarySection>
    );
});

const setAggregation = handleSelectChange((chartAggregation: TransactionsPageState["chartAggregation"]) =>
    CapybaraDispatch(AppSlice.actions.setTransactionsPagePartial({ chartAggregation }))
);

const setChartSign = handleSelectChange((chartSign: TransactionsPageState["chartSign"]) =>
    CapybaraDispatch(AppSlice.actions.setTransactionsPagePartial({ chartSign }))
);

const updateFilters = (update: Partial<TransactionsTableFilters>) =>
    CapybaraDispatch(
        AppSlice.actions.setTransactionsTablePartial({
            filters: {
                ...(CapybaraStore.getState().app.page as TransactionsPageState).table.filters,
                ...update,
            },
        })
    );

const getCategoryFilter = (category: ID): ID[] => {
    const { ids, entities } = CapybaraStore.getState().data.category;
    const children = ids.filter((id) => entities[id]!.hierarchy.includes(category) || id === category);
    return children.length === 0 ? [category] : (children as ID[]);
};
const setFilterID = zipObject(
    TransactionsPageAggregations,
    TransactionsPageAggregations.map(
        (aggregation) => (id: number, sign?: SummaryChartSign, fromDate?: string, toDate?: string) =>
            updateFilters({
                ...zipObject(
                    TransactionsPageAggregations,
                    TransactionsPageAggregations.map((_) => [])
                ),
                valueFrom: sign === "credits" ? 0 : undefined,
                valueTo: sign === "debits" ? 0 : undefined,
                [aggregation]: aggregation !== "category" ? [id] : getCategoryFilter(id),
                fromDate,
                toDate,
            })
    )
);
const clearFilter = () =>
    updateFilters({
        ...zipObject(
            TransactionsPageAggregations,
            TransactionsPageAggregations.map((_) => [])
        ),
        fromDate: undefined,
        toDate: undefined,
        valueFrom: undefined,
        valueTo: undefined,
    });
