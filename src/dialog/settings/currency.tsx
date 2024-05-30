import { Cancel, CheckCircle, Info } from '@mui/icons-material';
import { Button, CircularProgress, Link, TextField, Tooltip, Typography } from '@mui/material';
import { DateTime } from 'luxon';
import React, { useCallback, useEffect, useState } from 'react';
import { handleTextFieldChange } from '../../shared/events';
import { CapybaraDispatch } from '../../state';
import { DataSlice } from '../../state/data';
import { useUserData } from '../../state/data/hooks';
import { getCurrencyRates, updateSyncedCurrencies } from '../../state/logic/currencies';
import { Greys, Intents } from '../../styles/colours';
import { EditValueContainer } from '../shared';
import { SettingsDialogContents, SettingsDialogDivider, SettingsDialogPage } from './shared';
import { useLanguage } from '../../languages/languages-context';
import { CustomTextField } from '../../styles/theme';

export const DialogCurrencyContents: React.FC = () => {
    const key = useUserData(user => user.alphavantage);
    const lastSyncTime = useUserData(user => user.lastSyncTime);
    const [syncStatus, setSyncStatus] = useState<'fail' | 'loading' | 'success' | 'demo'>(
        key === 'demo' ? 'demo' : 'loading'
    );
    const { language, translations } = useLanguage();

    useEffect(() => {
        setSyncStatus('loading');
        const checkKeyValidity = async () => {
            if (key === 'demo') {
                setSyncStatus('demo');
                return;
            }
            const values = await getCurrencyRates('currency', 'BRL', key);
            if (values === undefined) setSyncStatus('fail');
            else setSyncStatus('success');
        };
        checkKeyValidity();
    }, [key]);

    const [isSyncing, setIsSyncing] = useState(false);

    const syncCurrencies = useCallback(async () => {
        setIsSyncing(true);
        await updateSyncedCurrencies();
        setIsSyncing(false);
    }, []);

    return (
        <SettingsDialogPage title={translations[language].currencySync}>
            <Typography variant="body2">
                {translations[language].currencySyncDesc1}{' '}
                <Link href="https://www.alphavantage.co/" underline="hover">
                    AlphaVantage
                </Link>
                {', '}
                {translations[language].currencySyncDesc2}{' '}
                <Link href="https://www.alphavantage.co/support/#api-key" underline="hover">
                    {translations[language].signUpForAFreeAPIKey}
                </Link>
                .
            </Typography>
            <Typography variant="caption" sx={{ marginTop: 8, color: '#67656a', fontStyle: 'italic' }}>
                {translations[language].currencySyncDesc3}
            </Typography>
            <SettingsDialogDivider />
            <SettingsDialogContents>
                <EditValueContainer label={translations[language].apiKey}>
                    <CustomTextField value={key} onChange={setKeyValue} size="small" sx={{ marginRight: 12 }} />
                    {syncStatus === 'fail' ? (
                        <Cancel htmlColor={Intents.danger.light} />
                    ) : syncStatus === 'success' ? (
                        <CheckCircle htmlColor={Intents.success.light} />
                    ) : syncStatus === 'demo' ? (
                        <Tooltip title={translations[language].thisDemoOnlyWorksForEUR}>
                            <Info htmlColor={Intents.primary.light} />
                        </Tooltip>
                    ) : (
                        <CircularProgress />
                    )}
                </EditValueContainer>
                <EditValueContainer label={translations[language].manualSync}>
                    <Button onClick={syncCurrencies} variant="outlined" sx={{ height: 36, width: 160 }}>
                        {isSyncing ? <CircularProgress size={20} /> : translations[language].syncAll}
                    </Button>
                    {lastSyncTime !== undefined ? (
                        <Typography variant="body2" sx={{ fontStyle: 'italic', color: "#67656a", marginLeft: 16 }}>
                            {translations[language].lastSynced}{' '}
                            {DateTime.fromISO(lastSyncTime).toRelative({ unit: 'hours' })}
                        </Typography>
                    ) : undefined}
                </EditValueContainer>
            </SettingsDialogContents>
        </SettingsDialogPage>
    );
};

const setKeyValue = handleTextFieldChange(alphavantage =>
    CapybaraDispatch(DataSlice.actions.updateUserPartial({ alphavantage }))
);
