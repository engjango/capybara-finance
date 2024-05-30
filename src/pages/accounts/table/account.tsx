import styled from '@emotion/styled';
import { Add, Description, Edit, NoteAdd, Update } from '@mui/icons-material';
import { Button, ButtonBase, buttonClasses, Tooltip, Typography } from '@mui/material';
import { Dictionary } from '@reduxjs/toolkit';
import chroma from 'chroma-js';
import { cloneDeep, max, min, range, sumBy, toPairs } from 'lodash';
import React, { useCallback, useMemo } from 'react';
import { VictoryArea, VictoryAxis, VictoryChart, VictoryScatter } from 'victory';
import { fadeSolidColour } from '../../../components/display/ObjectDisplay';
import { getChartPerformanceProps, getHiddenTickZeroAxis } from '../../../components/display/PerformantCharts';
import { getNewTransaction } from '../../../components/table/table/header';
import { NBSP } from '../../../shared/constants';
import { formatNumber } from '../../../shared/data';
import { suppressEvent, withSuppressEvent } from '../../../shared/events';
import { CapybaraDispatch } from '../../../state';
import { AppSlice, DefaultPages } from '../../../state/app';
import { openNewPage } from '../../../state/app/actions';
import { DataSlice } from '../../../state/data';
import { useCurrencyMap, useDefaultCurrency } from '../../../state/data/hooks';
import { Account, AccountTypeMap, Currency } from '../../../state/data/types';
import { BalanceHistory, getToday, getTodayString, parseDate } from '../../../state/shared/values';
import { Greys, Intents, WHITE } from '../../../styles/colours';
import { useLanguage } from '../../../languages/languages-context';
import { AccountNameContainerBox, AccountUpdateActionsBox, AccountUpdateContainerBox, AccountValueContainerBox, AccountValueSummaryBox, ChartContainerBox, ContainerSx, SubValueTypography } from '../../../styles/theme';

export const AccountTableEntry: React.FC<{ account: Account }> = ({ account }) => {
    const currencies = useCurrencyMap();
    const defaultCurrency = useDefaultCurrency();
    const onClick = useCallback(
        (event: React.MouseEvent) => openNewPage({ ...DefaultPages.account, account: account.id }, event),
        [account.id]
    );

    const { value, summary, charts, domain } = getAccountSummaries(account, currencies, defaultCurrency);

    const markUpToDate = useMemo(
        () =>
            withSuppressEvent(() =>
                CapybaraDispatch(
                    DataSlice.actions.updateAccount({ id: account.id, changes: { lastUpdate: getTodayString() } })
                )
            ),
        [account.id]
    );

    const goToUploadDialog = useMemo(
        () =>
            withSuppressEvent(() =>
                CapybaraDispatch(
                    AppSlice.actions.setDialogPartial({
                        id: 'import',
                        import: { page: 'file', rejections: [], account },
                    })
                )
            ),
        [account]
    );

    const createNewTransaction = useMemo(
        () =>
            withSuppressEvent(() => {
                const newPageState = cloneDeep(DefaultPages.account);
                newPageState.account = account.id;
                newPageState.table.state.edit = getNewTransaction();
                newPageState.table.state.edit.account = account.id;

                CapybaraDispatch(AppSlice.actions.setPageState(newPageState));
            }),
        [account.id]
    );

    const { language, translations } = useLanguage();

    const getTranslatedAccountType = (category: string) => {
        switch (category) {
            case 'Asset':
                return translations[language].accountTypeAsset;
            case 'Investment Account':
                return translations[language].accountTypeInvestment;
            case 'Transaction Account':
                return translations[language].accountTypeTransaction;
            default:
                return translations[language].accountTypeUndefined;
        }
    };

    return (
        <ButtonBase key={account.id} sx={ContainerSx} component="div" onClick={onClick}>
            <AccountNameContainerBox>
                <Typography variant="h6" noWrap={true}>
                    {account.name}
                </Typography>
                <SubValueTypography variant="body2" noWrap={true}>
                    {getTranslatedAccountType(AccountTypeMap[account.category].name)}
                </SubValueTypography>
            </AccountNameContainerBox>
            <ChartContainerBox>
                <VictoryChart
                    height={45}
                    //width={330}
                    padding={{ top: 0, right: 2, bottom: 0, left: 0 }}
                    domainPadding={{ y: 3 }}
                    {...getChartPerformanceProps(domain)}
                >
                    {getHiddenTickZeroAxis("#67656a")}
                    <VictoryAxis 
                        dependentAxis
                        style={{
                            axis: {display: "none"},
                            ticks: {display: "none"},
                            tickLabels: {display: "none"},
                            grid: {display: "none"},
                        }}
                    />
                    {charts}                    
                </VictoryChart>
            </ChartContainerBox>
            <AccountValueContainerBox>
                <AccountValueSummaryBox>{summary}</AccountValueSummaryBox>
                <SubValueTypography variant="body2">{value}</SubValueTypography>
            </AccountValueContainerBox>
            {/*account.lastStatementFormat ? <DescriptionAccountIcon /> : <EditAccountIcon />*/}
            <AccountUpdateContainerBox>
                <AccountUpdateActionsBox onMouseDown={suppressEvent}>
                    <Tooltip title="Mark Up-To-Date">
                        <Button
                            size="small"
                            startIcon={<Update htmlColor={'#fff'} />}
                            onClick={markUpToDate}
                            color="inherit"
                            style={{ borderRadius: '50%', border: '1px solid #fff' }}
                        />
                    </Tooltip>
                    <Tooltip title="Upload Statement">
                        <Button
                            size="small"
                            startIcon={<NoteAdd htmlColor={'#fff'} />}
                            onClick={goToUploadDialog}
                            color="inherit"
                            style={{ borderRadius: '50%', border: '1px solid #fff' }}
                        />
                    </Tooltip>
                    <Tooltip title="Create Transaction">
                        <Button
                            size="small"
                            startIcon={<Add htmlColor={'#fff'} />}
                            color="inherit"
                            onClick={createNewTransaction}
                            style={{ borderRadius: '50%', border: '1px solid #fff' }}
                        />
                    </Tooltip>
                </AccountUpdateActionsBox>
                {getAccountAgeDescription(account)}
            </AccountUpdateContainerBox>
        </ButtonBase>
    );
};

const getAccountSummaries = (account: Account, currencies: Dictionary<Currency>, defaultCurrency: Currency) => {
    const balances = toPairs(account.balances);

    const value =
        defaultCurrency.symbol +
        ' ' +
        formatNumber(
            sumBy(balances, ([_, balance]) => balance.localised[0]),
            { end: 'k' }
        );
    const positive = sumBy(balances, ([_, balance]) => balance.localised[0]) >= 0;
    const summary = getAccountSummary(balances, currencies, defaultCurrency);

    const values = range(12).map(i => sumBy(balances, ([_, balance]) => balance.localised[i]) || 0);
    const domain = {
        x: [-0.5, 11.5] as [number, number],
        y: [min(values.concat([0])), max(values.concat([0]))] as [number, number],
    };

    const charts = [
        <defs key="gradientGreen">
            <linearGradient id="gradientGreen" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#0f9960', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#242020', stopOpacity: 1 }} />
            </linearGradient>
        </defs>,
        <defs key="gradientRed">
            <linearGradient id="gradientRed" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#242020', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#db3737', stopOpacity: 1 }} />
            </linearGradient>
        </defs>,
        <VictoryArea
            data={range(12).map(i => ({ y: values[i], x: i === 0 ? 11.1 : 11 - i }))}
            interpolation="monotoneX"
            style={{
                data: {
                    fill: positive ? 'url(#gradientGreen)' : 'url(#gradientRed)',
                    stroke: positive ? '#0f9960' : '#db3737',
                    strokeWidth: 2,
                },
            }}
            key={0}
        />,
        <VictoryScatter
            data={[{ x: 11, y: sumBy(balances, ([_, balance]) => balance.localised[0]) }]}
            style={{
                data: {
                    fill: '#fff',
                    stroke: '#fff',
                    strokeWidth: 3,
                },
            }}
            key={1}
        />,
    ];

    return { value, summary, charts, domain };
};

const getAccountSummary = (
    balances: [string, BalanceHistory][],
    currencies: Dictionary<Currency>,
    defaultCurrency: Currency
) => {
    const getColour = (balance: number) => Intents[!balance ? 'default' : balance < 0 ? 'danger' : 'success'].main;
    const hasBalance = ([_, balance]: [string, BalanceHistory]) => !!balance.localised[0];
    const hadRecentBalance = ([_, balance]: [string, BalanceHistory]) => range(12).some(i => balance.localised[i]);

    const summary = balances
        .filter(
            // prettier-ignore
            balances.some(hasBalance) ? hasBalance
          : balances.some(hadRecentBalance) ? hadRecentBalance
          : () => true
        )
        .map(([idStr, balance], _, array) => (
            <Typography variant="h6" style={{ color: getColour(balance.localised[0]) }} key={idStr} noWrap={true}>
                {currencies[Number(idStr)]!.symbol +
                    ' ' +
                    formatNumber(balance.original[0], { end: 'k', decimals: array.length === 1 ? 2 : 0 })}
            </Typography>
        ))
        .flatMap((element, i, array) =>
            i + 1 === array.length
                ? [element]
                : [
                      element,
                      <Typography key={i} variant="h6">
                          ,{NBSP}
                      </Typography>,
                  ]
        );
    summary[0] = summary[0] || (
        <Typography variant="h6" style={{ color: getColour(0) }} key={0} noWrap={true}>
            {defaultCurrency.symbol + ' 0.00'}
        </Typography>
    );
    return summary;
};

export const getAccountUpdateAgeLevel = (account: Account) => {
    const update = parseDate(max([account.lastTransactionDate, account.lastUpdate]));

    const updateLength = account.lastTransactionDate
        ? update!.diff(parseDate(account.lastTransactionDate), 'days').days
        : 0;
    const updateSince = update && getToday().diff(update, 'days').days;

    return {
        level:
            updateSince === undefined
                ? null
                : updateSince <= 30 || updateSince <= updateLength
                ? ('success' as const)
                : updateSince <= 60 || updateSince <= 2 * updateLength
                ? ('warning' as const)
                : ('danger' as const),
        age: updateSince,
        date: update,
    };
};

const getAccountAgeDescription = (account: Account) => {
    const { age, level, date } = getAccountUpdateAgeLevel(account);

    const { language, translations } = useLanguage();

    return (
        <Typography
            variant="subtitle2"
            sx={{
                color: level === null ? '#67656a' : '#67656a',
                fontSize: '12px',
                padding: '6px',
            }}
        >
            {date
                ? translations[language].updated +
                  ' ' +
                  (age! >= 1
                      ? date.toRelative({ unit: ['years', 'months', 'weeks', 'days'] })
                      : translations[language].today)
                : translations[language].neverUpdated}
        </Typography>
    );
};