import { MenuItem, Select } from '@mui/material';
import React from 'react';
import { Section } from '../../../components/layout';
import { handleSelectChange } from '../../../shared/events';
import { CapybaraDispatch } from '../../../state';
import { AppSlice } from '../../../state/app';
import { useCategoriesPageState } from '../../../state/app/hooks';
import { CategoriesPageState } from '../../../state/app/pageTypes';
import { useCategoriesTableData } from './data';
import { CategoriesPageTableHeader } from './header';
import { TopLevelCategoryTableView } from './TopLevel';
import { useLanguage } from '../../../languages/languages-context';

export const CategoryTable: React.FC = () => {
    const { hideEmpty, tableMetric: metric, tableSign } = useCategoriesPageState();
    const { options, graph, chartFunctions, getCategoryStatistics } = useCategoriesTableData(
        hideEmpty,
        metric,
        tableSign
    );
    const { language, translations } = useLanguage();

    return (
        <Section
            title={translations[language].allCategories}
            headers={
                <Select
                    value={metric}
                    onChange={setMetric}
                    size="small"
                    style={{ color: '#fff', background: '#242020' }}
                >
                    <MenuItem value="current">{translations[language].currentMonth}</MenuItem>
                    <MenuItem value="previous">{translations[language].previousMonth}</MenuItem>
                    <MenuItem value="average">{translations[language].average12LastMonths}</MenuItem>
                </Select>
            }
            emptyBody={true}
        >
            <CategoriesPageTableHeader tableSign={tableSign} hideEmpty={hideEmpty} />
            {options.map(option => (
                <TopLevelCategoryTableView
                    key={option.id}
                    category={option}
                    graph={graph}
                    chartFunctions={chartFunctions}
                    getCategoryStatistics={getCategoryStatistics}
                    hideEmpty={hideEmpty}
                />
            ))}
        </Section>
    );
};

const setMetric = handleSelectChange((tableMetric: CategoriesPageState['tableMetric']) =>
    CapybaraDispatch(AppSlice.actions.setCategoriesPagePartial({ tableMetric }))
);
