import { last, range } from 'lodash';
import React, { useMemo } from 'react';
import { FlexWidthChart } from '../../components/display/FlexWidthChart';
import { Section } from '../../components/layout';
import { formatNumber } from '../../shared/data';
import { useDefaultCurrency } from '../../state/data/hooks';
import { CalculatorEstimates } from './data';
import {
    CalculatorContainer,
    CalculatorInputDivider,
    CalculatorInputGrid,
    CalculatorResultDisplay,
    CalculatorTickLengthCandidates,
    getCalculatorBalanceDisplayChart,
    useCalculatorInputDisplay,
    useNominalValueToggle,
} from './display';
import { useLanguage } from '../../languages/languages-context';

export const ForecastPageNetWorthCalculator: React.FC = () => {
    const { language, translations } = useLanguage();
    const currency = useDefaultCurrency();

    const savings = useCalculatorInputDisplay(
        translations[language].actualNetworth,
        translations[language].netWorthAtStartOfSimulation,
        currency.symbol,
        CalculatorEstimates.netWorth
    );
    const interest = useCalculatorInputDisplay(
        translations[language].interest,
        translations[language].interestRateOnAssetsAndLiabilities,
        translations[language].percentagePerYear,
        CalculatorEstimates.constant(4)
    );
    const income = useCalculatorInputDisplay(
        translations[language].incomes,
        translations[language].monthlyIncomeAtStartOfSimulation,
        currency.symbol,
        CalculatorEstimates.income
    );
    const expenses = useCalculatorInputDisplay(
        translations[language].expenses,
        translations[language].monthlyExpensesAtStartOfSimulation,
        currency.symbol,
        CalculatorEstimates.expenses
    );
    const length = useCalculatorInputDisplay(
        translations[language].length,
        translations[language].lengthOfSimulationInYears,
        translations[language].yrs,
        CalculatorEstimates.constant(20)
    );
    const inflation = useCalculatorInputDisplay(
        translations[language].inflation,
        translations[language].annualRateOfInflation,
        translations[language].percentagePerYear,
        CalculatorEstimates.constant(1.5)
    );

    const nominalValueToggle = useNominalValueToggle();

    const useSimulationResults = (
        savings: number,
        interest: number,
        income: number,
        expenses: number,
        years: number,
        inflation: number,
        symbol: string,
        showNominalValues: boolean
    ) =>
        useMemo(() => {
            let balances = [savings];
            for (let month of range(years * 12)) {
                const balance = balances[0] * (1 + interest / 12 / 100);
                const credit = income * Math.pow(1 + inflation / 12 / 100, month);
                const debit = expenses * Math.pow(1 + inflation / 12 / 100, month);

                balances.unshift(balance + credit - debit);
            }
            balances.reverse();

            if (!showNominalValues)
                balances.forEach((_, idx) => (balances[idx] /= Math.pow(1 + inflation / 12 / 100, idx)));

            const getRawCheckinDisplay = (month: number) => getCheckinDisplay(month, balances[month]);
            const getCheckinDisplay = (month: number, value: number) => {
                const colour =
                    savings > 0
                        ? value > savings
                            ? 'success'
                            : value < 0
                            ? 'danger'
                            : 'warning'
                        : value > savings
                        ? 'primary'
                        : 'danger';

                const title =
                    `${translations[language].valueIn} ` +
                    (month >= 12
                        ? Math.round((month / 12) * 10) / 10 + ` ${translations[language].year}` + (month > 12 ? 's' : '')
                        : month + ` ${translations[language].month}` + (month !== 1 ? 's' : ''));

                return (
                    <CalculatorResultDisplay
                        title={title}
                        intent={colour}
                        value={symbol + ' ' + formatNumber(value || 0, value > 1000000 ? { end: 'k' } : undefined)}
                    />
                );
            };

            const chart = getCalculatorBalanceDisplayChart(balances, symbol);

            let halfway = CalculatorTickLengthCandidates.findIndex(x => x > years * 12) - 2;
            if (halfway < 0)
                halfway =
                    CalculatorTickLengthCandidates.length -
                    (last(CalculatorTickLengthCandidates)! * 2 > years * 12 ? 2 : 1);

            return {
                results: (
                    <>
                        {getRawCheckinDisplay(CalculatorTickLengthCandidates[halfway])}
                        {getRawCheckinDisplay(years * 12)}
                    </>
                ),
                getChart: () => chart,
            };
        }, [savings, interest, income, expenses, years, inflation, symbol, showNominalValues]);

    const results = useSimulationResults(
        savings.value,
        interest.value,
        income.value,
        expenses.value,
        length.value,
        inflation.value,
        currency.symbol,
        nominalValueToggle.value
    );

    return (
        <CalculatorContainer>
            <Section title={translations[language].netWorth}>
                <CalculatorInputGrid>
                    {savings.input}
                    {interest.input}
                    {income.input}
                    {expenses.input}
                    {length.input}
                    {inflation.input}
                </CalculatorInputGrid>
                {nominalValueToggle.node}
                <CalculatorInputDivider />
                <CalculatorInputGrid>{results.results}</CalculatorInputGrid>
            </Section>
            <Section title=" ">
                <FlexWidthChart getChart={results.getChart} sx={{ '& svg': { overflow: 'visible' } }} />
            </Section>
        </CalculatorContainer>
    );
};
