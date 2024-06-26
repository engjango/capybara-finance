import { last, max, min, sortBy, sumBy, unzip } from 'lodash';
import { DateTime } from 'luxon';
import React, { useCallback, useMemo } from 'react';
import { VictoryAxis, VictoryBar, VictoryChart, VictoryStack } from 'victory';
import { formatNumber } from '../../shared/data';
import { ChartSign } from '../../state/app/pageTypes';
import { useDefaultCurrency } from '../../state/data/hooks';
import { formatDate, formatJSDate, getToday, ID } from '../../state/shared/values';
import { FlexWidthChart } from '../display/FlexWidthChart';
import {
    getBottomAlignedDateAxisFromDomain,
    getChartPerformanceProps,
    getHiddenTickZeroAxis,
} from '../display/PerformantCharts';
import { ChartPoint, getChartEvents, getChartSectionStyles, SummaryChartSign } from './shared';

export interface SummaryBarChartPoint {
    id: ID;
    colour: string;
    value: { credit: number; debit: number };
    trend: { credits: number[]; debits: number[] };
}
type SummaryBarChartProps = {
    series: SummaryBarChartPoint[];
    sign: ChartSign;
    setFilter?: (id: ID, sign?: SummaryChartSign, fromDate?: string, toDate?: string) => void;
    id?: string;
    highlightSeries?: boolean;
};
export const SummaryBarChart: React.FC<SummaryBarChartProps> = ({ series, sign, setFilter, id, highlightSeries }) => {
    const { symbol } = useDefaultCurrency();

    const { charts, domain } = useSummaryChartData(series, sign);
    const getChart = useCallback(
        () => (
            <VictoryChart
                //height={310}
                //animate={{ duration: 500, onLoad: { duration: 500 } }}
                padding={{ left: 100, top: 20, bottom: 20, right: 20 }}
                {...getChartPerformanceProps(domain, { x: 'time', y: 'linear' })}
                key={id} // This stupid trick (often?) prevents a bug with events when chart props change
                style={{
                    parent: {
                        background: 'linear-gradient(0deg, #080707, #242020)',
                    },
                }}
            >
                <VictoryAxis
                    dependentAxis={true}
                    tickFormat={(value: number) => symbol + ' ' + formatNumber(value, { end: 'k' })}
                    crossAxis={false}
                    invertAxis={sign === 'debits'}
                    style={{
                        axis: { stroke: '#fff' },
                        axisLabel: { fontSize: 12, padding: 5, fill: '#fff' },
                        ticks: { stroke: '#fff', size: 5 },
                        tickLabels: { fontSize: 14, padding: 5, fill: '#fff' },
                    }}
                />
                <VictoryStack
                    categories={[]}
                    events={
                        setFilter &&
                        getChartEvents(
                            (props: SummaryChartEvent) =>
                                setFilter(
                                    props.datum.id,
                                    sign === 'all' ? props.datum.sign : undefined,
                                    formatJSDate(props.datum.x),
                                    formatDate(
                                        DateTime.fromJSDate(props.datum.x).plus({ months: 1 }).minus({ days: 1 })
                                    )
                                ),
                            highlightSeries
                        )
                    }
                >
                    {charts
                        .filter(_ => _.some(p => p.y))
                        .map(points => (
                            <VictoryBar
                                sortKey="x"
                                key={points[0].id}
                                data={points}
                                barRatio={0.8}
                                style={getChartSectionStyles(setFilter !== undefined)}
                                domain={domain}
                            />
                        ))}
                </VictoryStack>
                {getHiddenTickZeroAxis()}
                {getBottomAlignedDateAxisFromDomain(domain.y, sign === 'debits')}
            </VictoryChart>
        ),
        [charts, sign, setFilter, symbol, domain, id, highlightSeries]
    );

    return (
        <FlexWidthChart
            style={{
                marginBottom: '16px',
                height: '100%',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
            }}
            getChart={getChart}
        />
    );
};

interface SummaryChartPoint extends ChartPoint {
    x: Date;
    y: number;
}
interface SummaryChartEvent {
    style: React.CSSProperties;
    datum: SummaryChartPoint;
    data: SummaryChartPoint[];
    index: number;
}

export const useSummaryChartData = (series: SummaryBarChartPoint[], sign: ChartSign) =>
    useMemo(() => {
        const sorted = sortBy(
            series,
            s => sign === 'all' && !(s.value.credit && s.value.debit),
            s => (sign !== 'debits' ? -s.value.credit : 0) + (sign !== 'credits' ? s.value.debit : 0)
        );

        const charts = sorted.flatMap(category =>
            (sign === 'all' ? (['credits', 'debits'] as const) : [sign]).map(trend =>
                category.trend[trend].map(
                    (y, idx) =>
                        ({
                            id: category.id,
                            x: getToday().startOf('month').minus({ months: idx }).toJSDate(),
                            y,
                            colour: category.colour,
                            sign: trend,
                        } as SummaryChartPoint)
                )
            )
        );

        const domain = {
            x: [
                DateTime.fromJSDate(min(charts.map(c => last(c)?.x)) || new Date())
                    .minus({ months: 1 })
                    .toJSDate(),
                getToday().startOf('month').plus({ months: 1 }).toJSDate(),
            ] as [Date, Date],
            y: [
                min(
                    unzip(charts)
                        .map(month => sumBy(month, point => Math.min(0, point?.y || 0)))
                        .concat([0])
                ),
                max(
                    unzip(charts)
                        .map(month => sumBy(month, point => Math.max(0, point?.y || 0)))
                        .concat([0])
                ),
            ] as [number, number],
        };

        return { charts, domain };
    }, [series, sign]);
