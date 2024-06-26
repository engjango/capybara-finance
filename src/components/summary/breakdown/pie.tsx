import styled from '@emotion/styled';
import { sumBy } from 'lodash-es';
import React, { useMemo } from 'react';
import { VictoryPie, VictoryPieProps } from 'victory';
import { ChartSign } from '../../../state/app/pageTypes';
import { ID } from '../../../state/shared/values';
import { Greys } from '../../../styles/colours';
import { ChartPoint, getChartEvents, getChartSectionStyles, SummaryChartSign } from '../shared';

const PieContainerSvg = styled('svg')({
    flexShrink: 0,
    padding: 10,
    borderRadius: '50%',
    background: Greys[100],
    alignSelf: 'center',
    marginTop: 20,
});

interface PieChartDatum extends ChartPoint {
    value: number;
}
interface SummaryPieEventProps {
    style: React.CSSProperties;
    datum: PieChartDatum;
}

interface SummaryPieChartPoint {
    id: ID | null;
    colour?: string;
    value: {
        credit: number;
        debit: number;
    };
}
type SummaryPieChartProps = {
    series: SummaryPieChartPoint[];
    sign: ChartSign;
    setFilter?: (id: ID, sign?: SummaryChartSign) => void;
};
export const SummaryPieChart: React.FC<SummaryPieChartProps> = ({ series, sign, setFilter }) => {
    const credits = useMaybePieChartData('credits', series, sign);
    const debits = useMaybePieChartData('debits', series, sign);

    const getPie = useGetPie(setFilter, sign);

    const totalCredits = sumBy(series, p => p.value.credit);
    const totalDebits = sumBy(series, p => Math.abs(p.value.debit));
    const maxPieSize = Math.max(totalCredits, totalDebits);

    return (
        <PieContainerSvg height={125} width={125} style={{ backgroundColor: '#242020' }}>
            {sign === 'all' ? (
                <>
                    {getPie(credits, 35, 50, maxPieSize && (totalCredits / maxPieSize) * 360)}
                    {getPie(debits, 15, 30, maxPieSize && (totalDebits / maxPieSize) * 360)}
                </>
            ) : (
                <>
                    {getPie(credits, 25, 50)}
                    {getPie(debits, 25, 50)}
                </>
            )}
        </PieContainerSvg>
    );
};

const useGetPie = (setFilter: ((id: ID, sign?: SummaryChartSign) => void) | undefined, sign: ChartSign) => {
    const props = useMemo<VictoryPieProps>(
        () => ({
            y: 'value',
            x: 'id',
            standalone: false,
            width: 105,
            height: 105,
            //animate: { duration: 500, onLoad: { duration: 500 } },
            labels: () => null,
            padAngle: 5,
            events:
                setFilter &&
                getChartEvents(({ datum: { id, sign: series } }: SummaryPieEventProps) =>
                    setFilter(id, sign === 'all' ? series : undefined)
                ),
            style: getChartSectionStyles(setFilter !== undefined),
        }),
        [setFilter, sign]
    );

    return (points: PieChartDatum[] | undefined, innerRadius: number, radius: number, endAngle?: number) =>
        points && (
            <VictoryPie data={points.filter(({ value }) => value)} {...props} {...{ innerRadius, radius, endAngle }} />
        );
};

const useMaybePieChartData = (sign: 'credits' | 'debits', series: SummaryPieChartPoint[], selectedSign: ChartSign) =>
    useMemo(
        () =>
            selectedSign === 'all' || selectedSign === sign
                ? series.map(
                      p =>
                          ({
                              id: p.id,
                              colour: p.colour,
                              value: Math.abs(p.value[sign === 'credits' ? 'credit' : 'debit']),
                              sign,
                          } as PieChartDatum)
                  )
                : undefined,
        [sign, series, selectedSign]
    );
