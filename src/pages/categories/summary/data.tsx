import { mean } from 'lodash';
import { useMemo } from 'react';
import { SummaryBreakdownDatum } from '../../../components/summary';
import { formatNumber } from '../../../shared/data';
import { CategoriesPageState } from '../../../state/app/pageTypes';
import { useAllCategories } from '../../../state/data/hooks';
import { TRANSFER_CATEGORY_ID } from '../../../state/data/shared';
import { CategoriesMetricLookbackPeriods } from '../table/data';
import { CategoriesBarSummaryPoint } from './budget';
import { useLanguage } from '../../../languages/languages-context';

export const useCategoryBudgetSummaryData = (
    metric: CategoriesPageState['tableMetric']
): (SummaryBreakdownDatum & CategoriesBarSummaryPoint)[] => {
    const categories = useAllCategories();
    const lookback = CategoriesMetricLookbackPeriods[metric];
    const { language, translations } = useLanguage();

    return useMemo(() => {
        return categories
            .filter(({ id, hierarchy }) => hierarchy.length === 0 && id !== TRANSFER_CATEGORY_ID)
            .map(category => {
                const value = mean(
                    lookback.map(i => (category.transactions.credits[i] || 0) + (category.transactions.debits[i] || 0))
                );
                const budget = mean(lookback.map(i => category.budgets?.values[i] || 0));

                const debit = budget !== 0 ? budget < 0 : value < 0;

                return {
                    // Common data
                    id: category.id,
                    name: category.name,
                    colour: category.colour,

                    // SummaryBreakdownDatum
                    value: {
                        credit: 0,
                        debit: 0,
                        [debit ? 'debit' : 'credit']: value - budget,
                    },
                    subtitle: category.budgets
                        ? {
                              base: translations[language].monthlyBudget,
                              rollover: translations[language].rolloverBudget,
                              copy: translations[language].repeatedBudget,
                          }[category.budgets!.strategy]
                        : translations[language].noBudget,
                    subValue: {
                        type: 'string',
                        credit: '',
                        debit: '',
                        [debit ? 'debit' : 'credit']: `${
                            formatNumber(value, { end: 'k' })} / ${
                            category.budgets ? formatNumber(budget, { end: 'k' }) : formatNumber(0, { end: 'k' })
                        }`,
                    },
                    debit,
                    // CategoriesBarSummaryPoint
                    total: value,
                    budget,
                };
            });
    }, [categories, lookback]);
};
