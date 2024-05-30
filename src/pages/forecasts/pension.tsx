import { range } from "lodash";
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

export const ForecastPagePensionCalculator: React.FC = () => {
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
    const length = useCalculatorInputDisplay(
        translations[language].length,
        translations[language].lengthOfRetirementInYears,
        translations[language].yrs,
        CalculatorEstimates.constant(0),
        translations[language].indefinite
    );

    const nominalValueToggle = useNominalValueToggle();

    const results = useSimulationResults(
        netWorth.value,
        interest.value,
        savings.value,
        length.value,
        horizon.value,
        inflation.value,
        currency.symbol,
        nominalValueToggle.value
    );

    return (
        <CalculatorContainer>
            <Section title={translations[language].retirementIncome}>
                <CalculatorInputGrid>
                    {netWorth.input}
                    {interest.input}
                    {savings.input}
                    {inflation.input}
                    {horizon.input}
                    {length.input}
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
    retirementLength: number,
    horizon: number,
    inflation: number,
    symbol: string,
    showNominalValues: boolean
) =>
    useMemo(() => {
        const {language, translations} = useLanguage();
        
        const months = horizon * 12 + (retirementLength ? Math.min(retirementLength * 12, 100 * 12 + 1) : 100 * 12 + 1);

        let balances = [netWorth];
        let expenses = 0;
        for (let month of range(months)) {
            if (month === horizon * 12) {
                // See also: https://en.wikipedia.org/wiki/Mortgage_calculator#Monthly_payment_formula
                const principal = balances[0];
                const rate = (1 + interest / 12 / 100) / (1 + inflation / 12 / 100);

                let nominalExpenses: number;
                if (!retirementLength) nominalExpenses = ((interest - inflation) / 12 / 100) * principal;
                else if (interest === 0) nominalExpenses = principal / (retirementLength * 12 - 1);
                else nominalExpenses = ((rate - 1) * principal) / (1 - Math.pow(rate, -(retirementLength * 12 - 1)));

                expenses = nominalExpenses / Math.pow(1 + inflation / 12 / 100, month);
            }

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
                    <CalculatorResultDisplay
                        title={translations[language].monthlyIncome}
                        intent={retirement > 0 ? "primary" : "danger"}
                        value={
                            symbol +
                            " " +
                            formatNumber(
                                expenses * (showNominalValues ? Math.pow(1 + inflation / 12 / 100, horizon * 12) : 1),
                                retirement > 1000000 ? { end: "k" } : undefined
                            )
                        }
                    />
                </>
            ),
            getChart: () => chart,
        };
    }, [netWorth, interest, savings, retirementLength, horizon, inflation, symbol, showNominalValues]);
