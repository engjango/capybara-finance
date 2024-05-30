import { MenuItem, Select } from '@mui/material';
import { Box } from '@mui/system';
import { Section, SECTION_MARGIN } from '../../../components/layout';
import { SummaryBreakdown } from '../../../components/summary';
import { handleSelectChange } from '../../../shared/events';
import { CapybaraDispatch } from '../../../state';
import { AppSlice } from '../../../state/app';
import { useCategoriesPageState } from '../../../state/app/hooks';
import { CategoriesPageState } from '../../../state/app/pageTypes';
import { CategoriesBarSummary } from './budget';
import { CategoriesBarChart } from './chart';
import { useCategoryBudgetSummaryData } from './data';
import { CategoriesPageNoBudgetSummary } from './placeholder';
import { useLanguage } from '../../../languages/languages-context';

export const CategoriesPageSummary: React.FC = () => {
    const { summaryMetric: metric } = useCategoriesPageState(state => state);
    const data = useCategoryBudgetSummaryData(metric);
    const { language, translations } = useLanguage();

    if (!data.some(category => category.budget)) return <CategoriesPageNoBudgetSummary />;

    const HelpText: Record<CategoriesPageState['summaryMetric'], string> = {
        current: translations[language].allTransactionsCurrentMonth, 
        previous: translations[language].allTransactionsPreviousMonth,
        average: translations[language].MonthlyAverageOverPrevious12Months,
    };    

    return (
        <Box
            sx={{
                display: 'flex',
                '& > div:first-of-type': {
                    flex: '350px 0 0',
                    marginRight: SECTION_MARGIN,
                },
                '& > div:last-child': {
                    flexGrow: 1,
                },
            }}
        >
            <Section
                title={translations[language].budget}
                headers={[
                    <Select value={metric} onChange={setMetric} size="small" key="metric" style={{color: "#fff", background: "#242020"}}>
                        <MenuItem value="current">{translations[language].currentMonth}</MenuItem>
                        <MenuItem value="previous">{translations[language].previousMonth}</MenuItem>
                        <MenuItem value="average">{translations[language].average12LastMonths}</MenuItem>
                    </Select>,
                ]}
                PaperSx={{ height: "min-content", display: 'flex', flexDirection: 'column' }}
            >
                <SummaryBreakdown
                    data={data}
                    sign="all"
                    creditsName={ translations[language].incomeVsBudget }
                    debitsName={ translations[language].expenseVsBudget }
                    help={HelpText[metric]}
                    colorise={true}
                >
                    <CategoriesBarSummary points={data} />
                </SummaryBreakdown>
            </Section>
            <CategoriesBarChart />
        </Box>
    );
};

const setMetric = handleSelectChange((summaryMetric: CategoriesPageState['summaryMetric']) =>
    CapybaraDispatch(AppSlice.actions.setCategoriesPagePartial({ summaryMetric }))
);
