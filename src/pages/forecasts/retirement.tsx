import { last, range } from "lodash";
import React, { useMemo } from "react";
import { FlexWidthChart } from "../../components/display/FlexWidthChart";
import { Section } from "../../components/layout";
import { formatNumber } from "../../shared/data";
import { useDefaultCurrency } from "../../state/data/hooks";
import { CalculatorEstimates } from "./data";
import {
    CalculatorContainer,
    CalculatorInputDivider,
    CalculatorInputGrid,
    CalculatorResultDisplay,
    getCalculatorBalanceDisplayChart,
    useCalculatorInputDisplay,
    useNominalValueToggle,
} from "./display";
import { useLanguage } from "../../languages/languages-context";

export const ForecastPageRetirementCalculator: React.FC = () => {
    const {language, translations} = useLanguage();

    const currency = useDefaultCurrency();

    const netWorth = useCalculatorInputDisplay(
        translations[language].startValue,
        translations[language].netWorthAtStartOfSimulation,
        currency.symbol,
        CalculatorEstimates.netWorth
    );
    const interest = useCalculatorInputDisplay(
        translations[language].interest,
        translations[language].growthRateUsuallyAnAverageInterestRate,
        translations[language].percentagePerYear,
        CalculatorEstimates.constant(4)
    );
    const savings = useCalculatorInputDisplay(
        translations[language].savings,
        translations[language].monthlySavingsPriorToRetirmentInTodaysValue,
        currency.symbol,
        CalculatorEstimates.savings
    );
    const inflation = useCalculatorInputDisplay(
        translations[language].inflation,
        translations[language].annualRateOfInflation,
        translations[language].percentagePerYear,
        CalculatorEstimates.constant(1.5)
    );
    const horizon = useCalculatorInputDisplay(
        translations[language].horizon,
        translations[language].yearsBeforeRetirementDate,
        translations[language].yrs,
        CalculatorEstimates.constant(30)
    );
    const expenses = useCalculatorInputDisplay(
        translations[language].expenses,
        translations[language].monthlyExpensesDuringRetirementInTodaysValues,
        currency.symbol,
        CalculatorEstimates.expenses
    );

    const nominalValueToggle = useNominalValueToggle();

    const results = useSimulationResults(
        netWorth.value,
        interest.value,
        savings.value,
        expenses.value,
        horizon.value,
        inflation.value,
        currency.symbol,
        nominalValueToggle.value
    );

    return (
        <CalculatorContainer>
            <Section title={translations[language].retirementLength}>
                <CalculatorInputGrid>
                    {netWorth.input}
                    {interest.input}
                    {savings.input}
                    {inflation.input}
                    {horizon.input}
                    {expenses.input}
                </CalculatorInputGrid>
                {nominalValueToggle.node}
                <CalculatorInputDivider />
                <CalculatorInputGrid>{results.results}</CalculatorInputGrid>
            </Section>
            <Section title=" ">
                <FlexWidthChart getChart={results.getChart} sx={{ "& svg": { overflow: "visible" } }} />
            </Section>
        </CalculatorContainer>
    );
};

const useSimulationResults = (
    netWorth: number,
    interest: number,
    savings: number,
    expenses: number,
    horizon: number,
    inflation: number,
    symbol: string,
    showNominalValues: boolean
) =>
    useMemo(() => {
        const {language, translations} = useLanguage();

        const years = horizon + 100;

        let balances = [netWorth];
        for (let month of range(years * 12)) {
            const balance = balances[0] * (1 + interest / 12 / 100);
            const credit = month < horizon * 12 ? savings * Math.pow(1 + inflation / 12 / 100, month) : 0;
            const debit = month < horizon * 12 ? 0 : expenses * Math.pow(1 + inflation / 12 / 100, month);

            if (balance + credit < debit) {
                balances.unshift(0);
                break;
            }

            balances.unshift(balance + credit - debit);
        }
        balances.reverse();

        if (!showNominalValues)
            balances.forEach((_, idx) => (balances[idx] /= Math.pow(1 + inflation / 12 / 100, idx)));

        const retirement = balances[horizon * 12];
        const length = balances.length - 1 - horizon * 12;

        const chart = getCalculatorBalanceDisplayChart(balances, symbol, horizon);

        return {
            results: (
                <>
                    <CalculatorResultDisplay
                        title={translations[language].valueAtRetirement}
                        intent={retirement > 0 ? "primary" : "danger"}
                        value={
                            symbol +
                            " " +
                            formatNumber(retirement || 0, retirement > 1000000 ? { end: "k" } : undefined)
                        }
                    />
                    {(retirement || 0) <= 0 ? (
                        <CalculatorResultDisplay title={translations[language].lengthOfRetirementInYears} value="N/A" />
                    ) : last(balances)! > 0.0001 ? (
                        <CalculatorResultDisplay title={translations[language].lengthOfRetirementInYears} intent="success" value={`>100 ${translations[language].years}`} />
                    ) : (
                        <CalculatorResultDisplay
                            title={translations[language].lengthOfRetirementInYears}
                            intent="primary"
                            value={
                                length >= 12
                                    ? `${Math.round((length / 12) * 10) / 10} ${translations[language].year}${(length > 12 ? "s" : "")}`
                                    : `${length} ${translations[language].month}${(length !== 1 ? "s" : "")}`
                            }
                        />
                    )}
                </>
            ),
            getChart: () => chart,
        };
    }, [netWorth, interest, savings, expenses, horizon, inflation, symbol, showNominalValues]);
