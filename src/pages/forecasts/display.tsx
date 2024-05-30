import styled from '@emotion/styled';
import { HelpOutlined } from '@mui/icons-material';
import { FormControlLabel, Grid, Switch, TextField, Tooltip, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { max, min, range } from 'lodash';
import React, { useCallback, useMemo, useState } from 'react';
import { VictoryAxis, VictoryChart, VictoryLine, VictoryTheme, VictoryTooltip, VictoryVoronoiContainer } from 'victory';
import { getChartPerformanceProps } from '../../components/display/PerformantCharts';
import { SECTION_MARGIN } from '../../components/layout';
import { formatNumber } from '../../shared/data';
import { useNumericInputHandler } from '../../shared/hooks';
import { FCWithChildren } from '../../shared/types';
import { Greys, Intents } from '../../styles/colours';
import { useLanguage } from '../../languages/languages-context';

export const CalculatorContainer = styled('div')({
    display: 'flex',
    flexDirection: "row",

    '@media screen and (min-width: 1024px)':{
        '& > div:first-of-type': {
            flex: "400px 0 0",
            marginRight: "40px",
        },
        '& > div:last-of-type': {
            flexGrow: 1,
        },
    },
    '@media screen and (max-width: 1024px)':{
        display: 'grid',
        flexDirection: "column",

        '& > div:first-of-type': {
            marginRight: "16px",
        },
        '& > div:last-of-type': {
            //flexGrow: 1,
            marginTop: "-44px",
            marginRight: "16px",
        },
    },
});

export const CalculatorInputGrid: FCWithChildren = ({ children }) => (
    <Grid container={true} spacing={24}>
        {children}
    </Grid>
);

export const useCalculatorInputDisplay = (
    title: string,
    help: string,
    measure: string,
    estimate: () => number,
    placeholder?: string
) => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const defaultValue = useMemo(() => Math.round(estimate() * 100) / 100, []);

    const [value, setValue] = useState<number | null>(null);
    const handler = useNumericInputHandler(value, setValue);

    return {
        value: value ?? defaultValue,
        input: (
            <Grid
                item={true}
                xs={6}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: 4,
                    }}
                >
                    <Typography
                        variant="subtitle2"
                        sx={{
                            //textTransform: 'uppercase',
                            color: Greys[400],
                            marginRight: 8,
                            fontWeight: 100,
                        }}
                    >
                        {title}
                    </Typography>
                    <Typography
                        variant="caption"
                        sx={{
                            textTransform: 'uppercase',
                            color: '#67656a',
                            flexGrow: 1,
                        }}
                    >
                        ({measure})
                    </Typography>
                    <Tooltip title={help}>
                        <HelpOutlined
                            sx={{
                                fontSize: 16,
                                marginLeft: 10,
                            }}
                            htmlColor={'#67656a'}
                        />
                    </Tooltip>
                </Box>
                <TextField
                    size="small"
                    placeholder={placeholder || '' + defaultValue}
                    sx={{
                        width: '100%',
                    }}
                    value={handler.text}
                    onChange={handler.onTextChange}
                />
            </Grid>
        ),
    };
};

export const CalculatorInputDivider = styled('div')({
    ///borderTop: '1px solid #67656a',
    margin: '24px 55px 32px 55px',
});

export const CalculatorResultDisplay: React.FC<{ title: string; intent?: keyof typeof Intents; value: string }> = ({
    title,
    intent,
    value,
}) => (
    <Grid
        item={true}
        xs={6}
        sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
        }}
    >
        <Typography
            variant="caption"
            color={'#718069'}
            sx={{
                textTransform: 'uppercase',
                lineHeight: 1,
            }}
        >
            {title}
        </Typography>
        <Typography variant="h6" color={intent ? Intents[intent].main : '#718069'} noWrap={true}>
            {value}
        </Typography>
    </Grid>
);

export const useNominalValueToggle = (disabled?: boolean) => {
    const [showNominalValues, setShowNominalValues] = useState(true);
    const toggleShowNominalValues = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => setShowNominalValues(event.target.checked),
        []
    );
    const { language, translations } = useLanguage();
    const node = (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                margin: '8px 8px -20px 0',
                color: '#67656a',
            }}
        >
            <FormControlLabel
                control={<Switch size="small" checked={showNominalValues} onChange={toggleShowNominalValues} />}
                label={
                    <Typography variant="caption">
                        {showNominalValues
                            ? translations[language].showNominalValues
                            : translations[language].showRealValues}
                    </Typography>
                }
                labelPlacement="start"
                disabled={disabled}
            />
        </Box>
    );

    return { value: showNominalValues, node };
};

export const CalculatorTickLengthCandidates = [1, 2, 4, 6, 12, 24, 60, 120, 240, 600];

export const getCalculatorBalanceDisplayChart = (balances: number[], symbol: string, horizon?: number) => {
    const getTicks = (step: number) => range(step, balances.length, step);
    const tickValues = getTicks(CalculatorTickLengthCandidates.find(i => balances.length - 1 < i * 6) || 240);
    const { language, translations } = useLanguage();

    return (
        <VictoryChart
            //height={355}
            //animate={true}
            padding={{
                left: 90,
                right: 30,
                top: 10,
                bottom: 30,
            }}
            {...getChartPerformanceProps({
                x: [-1, balances.length],
                y: [Math.min((min(balances) || 0) * 1.02, 0), Math.max((max(balances) || 0) * 1.02, 0)],
            })}
            theme={VictoryTheme.material}
            containerComponent={
                <VictoryVoronoiContainer
                    voronoiDimension="x"
                    labels={({ datum }) =>
                        `${Math.round((datum.x / 12) * 10) / 10} ${
                            translations[language].year
                        }s: ${symbol} ${formatNumber(datum.y, {
                            end: 'k',
                            decimals: 1,
                        })}`
                    }
                    labelComponent={<VictoryTooltip flyoutStyle={{ fill: '#fff' }} />}
                    voronoiBlacklist={['horizon']}
                />
            }
            style={{
                parent: {
                    backgroundColor: '#080707',
                },
            }}
        >
            <VictoryAxis
                dependentAxis={true}
                tickFormat={(value: number) => `${symbol} ${formatNumber(value, { end: 'k', decimals: 1 })}`}
                style={{
                    axis: { stroke: '#fff' },
                    axisLabel: { fontSize: 12, padding: 5, fill: '#fff' },
                    ticks: { stroke: '#fff', size: 5 },
                    tickLabels: { fontSize: 14, padding: 5, fill: '#fff' },
                    grid: { stroke: '#67656a', strokeWidth: 0.73 },
                }}
            />
            <VictoryAxis
                tickValues={tickValues}
                tickFormat={
                    balances.length > 36
                        ? (month: number) => `${Math.round(month / 12)} ${translations[language].years}`
                        : (month: number) => `${month} ${translations[language].months}`
                }
                orientation="bottom"
                style={{
                    axis: { visibility: 'hidden', stroke: '#fff' },
                    axisLabel: { fontSize: 12, padding: 5, fill: '#fff' },
                    ticks: { stroke: '#67656a', size: 5 },
                    tickLabels: { fontSize: 14, padding: 5, fill: '#fff' },
                    grid: { stroke: '#67656a', strokeWidth: 0.73 },
                }}
            />
            {horizon ? <VictoryLine name="horizon" x={() => horizon * 12} /> : undefined}
            <VictoryLine
                data={balances.map((y, x) => ({ x, y }))}
                style={{
                    data: {
                        stroke: '#7000ff',
                        strokeWidth: 2,
                    },
                }}
            />
        </VictoryChart>
    );
};
