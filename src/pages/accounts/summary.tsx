import { MenuItem, Select } from '@mui/material';
import { Section } from '../../components/layout';
import { SummaryBarChart, SummaryBreakdown, SummarySection, useBalanceSummaryData } from '../../components/summary';
import { SummaryChartSign } from '../../components/summary/shared';
import { zipObject } from '../../shared/data';
import { handleSelectChange } from '../../shared/events';
import { CapybaraDispatch } from '../../state';
import { AppSlice } from '../../state/app';
import { useAccountsPageState } from '../../state/app/hooks';
import { AccountsPageAggregations, AccountsPageState } from '../../state/app/pageTypes';
import { useLanguage } from '../../languages/languages-context';

export const AccountsPageSummary: React.FC = () => {
    const aggregation = useAccountsPageState(state => state.chartAggregation);
    const sign = useAccountsPageState(state => state.chartSign);
    const data = useBalanceSummaryData(aggregation);
    const { language, translations } = useLanguage();

    return (
        <SummarySection>
            <Section title={translations[language].netWorth} onClick={clearFilter}>
                <SummaryBreakdown
                    data={data}
                    sign={sign}
                    creditsName={translations[language].assets}
                    debitsName={translations[language].liabilities}
                    help={translations[language].valueAtMostRecentUpdate}
                    setFilter={setFilterID[aggregation]}
                />
            </Section>
            <Section
                title=""
                headers={[
                    <Select
                        value={aggregation}
                        onChange={setAggregation}
                        size="small"
                        key="aggregation"
                        style={{ color: '#fff', background: '#242020' }}
                    >
                        <MenuItem value="account">{translations[language].byAccount}</MenuItem>
                        <MenuItem value="currency">{translations[language].ByCurrency}</MenuItem>
                        <MenuItem value="institution">{translations[language].ByInstitution}</MenuItem>
                        <MenuItem value="type">{translations[language].ByType}</MenuItem>
                    </Select>,
                    <Select
                        value={sign}
                        onChange={setChartSign}
                        size="small"
                        key="sign"
                        style={{ color: '#fff', background: '#242020' }}
                    >
                        <MenuItem value="all">{translations[language].allBalances}</MenuItem>
                        <MenuItem value="credits">{translations[language].assets}</MenuItem>
                        <MenuItem value="debits">{translations[language].liabilities}</MenuItem>
                    </Select>,
                ]}
                onClick={clearFilter}
            >
                <SummaryBarChart
                    series={data}
                    sign={sign}
                    setFilter={setFilterID[aggregation]}
                    id={aggregation + sign}
                    highlightSeries={true}
                />
            </Section>
        </SummarySection>
    );
};

const setAggregation = handleSelectChange((chartAggregation: AccountsPageState['chartAggregation']) =>
    CapybaraDispatch(AppSlice.actions.setAccountsPagePartial({ chartAggregation }))
);

const setChartSign = handleSelectChange((chartSign: AccountsPageState['chartSign']) =>
    CapybaraDispatch(AppSlice.actions.setAccountsPagePartial({ chartSign }))
);

const setFilterID = zipObject(
    AccountsPageAggregations,
    AccountsPageAggregations.map(
        aggregation => (id: number, sign?: SummaryChartSign, _1?: string, _2?: string) =>
            CapybaraDispatch(
                AppSlice.actions.setAccountsPagePartial({
                    ...zipObject(
                        AccountsPageAggregations,
                        AccountsPageAggregations.map(_ => [])
                    ),
                    [aggregation]: [id],
                    balances: sign || 'all',
                })
            )
    )
);
const clearFilter = () =>
    CapybaraDispatch(
        AppSlice.actions.setAccountsPagePartial({
            ...zipObject(
                AccountsPageAggregations,
                AccountsPageAggregations.map(_ => [])
            ),
            balances: 'all',
        })
    );
