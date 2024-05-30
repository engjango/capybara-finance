import { AttachMoney, TrendingDown, TrendingUp } from '@mui/icons-material';
import { clone, max, min, last, reverse } from 'lodash';
import React, { useCallback } from 'react';
import { VictoryAxis, VictoryBar, VictoryChart, VictoryLine } from 'victory';
import { formatNumber } from '../../shared/data';
import { useFormatValue, useMaybeDefaultCurrency } from '../../state/data/hooks';
import { Intents } from '../../styles/colours';
import { getChartPerformanceProps, getHiddenTickZeroAxis } from '../display/PerformantCharts';
import { SummaryNumber } from '../display/SummaryNumber';
import { SnapshotSectionData } from './data';
import { useLanguage } from '../../languages/languages-context';
import { DateTime } from 'luxon';
import { getToday } from '../../state/shared/values';
export * from './data';

export interface SnapshotSectionContentsProps {
    data: SnapshotSectionData;
}

export const TransactionSnapshotSummaryNumbers: React.FC<SnapshotSectionContentsProps> = ({
    data: { net, currency: currencyID },
}) => {
    const currency = useMaybeDefaultCurrency(currencyID).symbol;
    const { language, translations } = useLanguage();

    const average = ((net[0] || 0) + (net[1] || 0) + (net[2] || 0)) / 3;
    const previous = ((net[3] || 0) + (net[4] || 0) + (net[5] || 0)) / 3;

    return (
        <>   
            <SummaryNumber
                icon={average > previous ? TrendingUp : TrendingDown}
                primary={{
                    value: `${currency} ${formatNumber(average - previous, { start: '+' })}`,
                    positive: average === previous ? null : average > previous,
                }}
                secondary={{
                    value: formatNumber((average - previous) / previous, { start: '+', end: '%' }),
                    positive: average === previous ? null : average > previous,
                }}
                subtext={translations[language].versusPreviousMonth}
            />
            <SummaryNumber
                icon={AttachMoney}
                primary={{
                    value: `${currency} ${formatNumber(average, { start: '+' })}`,
                    positive: !average ? null : average > 0,
                }}
                subtext={translations[language].averageLastThreeMonths}
            />
        </>
    );
};

export const BalanceSnapshotSummaryNumbers: React.FC<SnapshotSectionContentsProps> = ({
    data: { net, currency: currencyID },
}) => {
    const currency = useMaybeDefaultCurrency(currencyID).symbol;
    const { language, translations } = useLanguage();

    const average = (net[0] - net[1]) / net[1];
    const previous = net[0] - net[1];
    const positive = net[0] === net[1] ? false : net[0] >= net[1];

    return (
        <>
            <SummaryNumber
                icon={AttachMoney}
                primary={{
                    value: `${currency} ${formatNumber(net[0])}`,
                    positive: !net[0] ? null : net[0] > 0,
                }}
                subtext={translations[language].valueToday}
            />
            <SummaryNumber
                icon={TrendingUp}
                primary={{
                    value: `${currency} ${formatNumber(previous, { start: '+' })}`,
                    positive: positive,
                }}
                secondary={{
                    value: formatNumber(average, { start: '+', end: '%' }),
                    positive: positive,
                }}
                subtext={translations[language].inLastMonth}
            />
        </>
    );
};

export const useGetSummaryChart = (
    { trends: { credits, debits }, net, currency }: SnapshotSectionData,
    height: number = 320
) => {
    const format = useFormatValue({ end: 'k', decimals: 1, separator: '' }, currency);

    return useCallback(() => {
        const minY = (min(debits) || 0) * 1.03;

        return (
            <VictoryChart
                animate={true}
                height={height}
                padding={{ left: 90, right: 30, top: 10, bottom: 40 }}
                {...getChartPerformanceProps({
                    x: [-0.7, Math.max(credits.length - 1, debits.length - 1)],
                    y: [(min(debits) || 0) * 1.02, (max(credits) || 0) * 1.02],
                })}
                style={{
                    parent: {
                        background: 'linear-gradient(0deg, #080707, #242020)',
                    },
                }}
            >
                {getHiddenTickZeroAxis('#fff')}
                <VictoryAxis
                    dependentAxis={true}
                    tickFormat={format}
                    style={{
                        axis: { stroke: '#fff' },
                        tickLabels: { fontSize: 12, fill: '#fff' },
                    }}
                    axisValue={-0.7}
                    crossAxis={false}
                />
                <VictoryBar
                    data={reverse(clone(credits))}
                    barRatio={1}
                    style={{ data: { fill: Intents.success.light, opacity: 0.4 } }}
                    minDomain={-1}
                />
                <VictoryBar
                    data={reverse(clone(debits))}
                    barRatio={1}
                    style={{ data: { fill: Intents.danger.light, opacity: 0.4 } }}
                />
                <VictoryLine data={reverse(clone(net))} style={{ data: { stroke: '#fff', strokeWidth: 3 } }} />
                <VictoryAxis
                    tickFormat={d => {
                        const currentDate = getToday()
                            .startOf('month')
                            .minus({ months: 24 - d })
                            .toJSDate();
                        return DateTime.fromJSDate(currentDate).toFormat('LLL yyyy');
                    }}
                    axisValue={minY || 0.001} 
                    orientation="bottom"
                    style={{
                        axisLabel: { fontSize: 12, padding: 5, fill: '#fff' },
                        ticks: { stroke: '#fff', size: 5 },
                        tickLabels: { fontSize: 14, padding: 5, fill: '#fff' },                        
                    }}
                />
            </VictoryChart>
        );
    }, [credits, debits, net, format, height]);
};