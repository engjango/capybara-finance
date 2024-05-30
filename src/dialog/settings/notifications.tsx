import styled from '@emotion/styled';
import { CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material';
import {
    Autocomplete,
    Checkbox,
    Collapse,
    ListItemText,
    Switch,
    TextField,
    Typography,
    collapseClasses,
    inputBaseClasses,
} from '@mui/material';
import { Box } from '@mui/system';
import React, { useCallback } from 'react';
import { useGetAccountIcon } from '../../components/display/ObjectDisplay';
import { useNumericInputHandler } from '../../shared/hooks';
import { CapybaraDispatch } from '../../state';
import { DataSlice } from '../../state/data';
import { useAllAccounts, useUserData } from '../../state/data/hooks';
import {
    ACCOUNTS_NOTIFICATION_ID,
    DEBT_NOTIFICATION_ID,
    MILESTONE_NOTIFICATION_ID,
    UNCATEGORISED_NOTIFICATION_ID,
} from '../../state/logic/notifications/types';
import { EditValueContainer } from '../shared';
import { SettingsDialogContents, SettingsDialogDivider, SettingsDialogPage } from './shared';
import { useLanguage } from '../../languages/languages-context';

export const DialogNotificationsContents: React.FC = () => {
    const { language, translations } = useLanguage();
    return (
        <SettingsDialogPage title={translations[language].notifications}>
            <Typography variant="body2">{translations[language].notificationsDesc}</Typography>
            <SettingsDialogDivider />
            <SettingsDialogContents>
                <NotificationToggle id={UNCATEGORISED_NOTIFICATION_ID} title={translations[language].uncategorizedTransactions} />
                <NotificationToggle
                    id={ACCOUNTS_NOTIFICATION_ID}
                    title={translations[language].outOfDateAccounts}
                    control={useAccountsAutocomplete()}
                />
                <NotificationToggle
                    id={MILESTONE_NOTIFICATION_ID}
                    title={translations[language].netWorthMilestones}
                    control={useNetWorthInput()}
                />
                <NotificationToggle id={DEBT_NOTIFICATION_ID} title={translations[language].debtMilestones} control={useDebtInput()} />
            </SettingsDialogContents>
        </SettingsDialogPage>
    );
};

const NotificationToggle: React.FC<{ id: string; title: string; control?: React.ReactNode }> = ({
    id,
    title,
    control,
}) => {
    const disabled = useUserData(user => user.disabled.includes(id));
    const toggle = useCallback(() => CapybaraDispatch(DataSlice.actions.toggleNotification(id)), [id]);

    return (
        <Box sx={{ marginBottom: 20 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="button">{title}</Typography>
                <Switch checked={!disabled} onChange={toggle} sx={{ margin: -5 }} />
            </Box>
            {control && (
                <Collapse in={!disabled} sx={{ [`& .${collapseClasses.wrapperInner} > div`]: { margin: 0 } }}>
                    {control}
                </Collapse>
            )}
        </Box>
    );
};

const useAccountsAutocomplete = () => {
    const accounts = useAllAccounts();
    const selected = useUserData(user => user.accountOutOfDate);
    const getAccountIcon = useGetAccountIcon();
    const {language, translations} = useLanguage();
    return (
        <EditValueContainer label={translations[language].ignoredAccounts}>
            <Autocomplete
                multiple={true}
                disableCloseOnSelect={true}
                sx={{ flexGrow: 1 }}
                options={accounts}
                getOptionLabel={account => account.name}
                defaultValue={accounts.filter(({ id }) => selected.includes(id))}
                renderInput={params => (
                    <TextField
                        {...params}
                        placeholder="(none)"
                        size="small"
                        sx={{
                            [`& .${inputBaseClasses.input}::placeholder`]: {
                                fontStyle: 'italic',
                            },
                        }}
                    />
                )}
                renderOption={(props, account, { selected }) => (
                    <li {...props}>
                        {getAccountIcon(account, IconSx)}
                        <AccountListItemText primary={account.name} />
                        <Checkbox
                            icon={<CheckBoxOutlineBlank fontSize="small" />}
                            checkedIcon={<CheckBox fontSize="small" />}
                            style={{ marginRight: 8 }}
                            checked={selected}
                            color="primary"
                        />
                    </li>
                )}
            />
        </EditValueContainer>
    );
};

const setNetWorthMilestone = (value: number | null) =>
    CapybaraDispatch(DataSlice.actions.updateUserPartial({ milestone: value ?? 10000 }));
const useNetWorthInput = () => {
    const milestone = useUserData(user => user.milestone);
    const input = useNumericInputHandler(milestone, setNetWorthMilestone);
    const {language, translations} = useLanguage();

    return (
        <EditValueContainer label={translations[language].previousNotification}>
            <TextField
                value={input.text}
                onChange={input.onTextChange}
                size="small"
                placeholder="10000"
                sx={{ flexGrow: 1 }}
            />
        </EditValueContainer>
    );
};

const setDebtMilestone = (value: number | null) =>
    CapybaraDispatch(DataSlice.actions.updateUserPartial({ debt: value ?? 10000 }));
const useDebtInput = () => {
    const debt = useUserData(user => user.debt);
    const input = useNumericInputHandler(debt, setDebtMilestone);
    const {language, translations} = useLanguage();
    return (
        <EditValueContainer label={translations[language].previousNotification}>
            <TextField
                value={input.text}
                onChange={input.onTextChange}
                size="small"
                placeholder="10000"
                sx={{ flexGrow: 1 }}
            />
        </EditValueContainer>
    );
};

const IconSx = {
    height: 20,
    width: 20,
    borderRadius: '4px',
    marginRight: 10,
};
const AccountListItemText = styled(ListItemText)({
    padding: '4px 0',

    '& span': {
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
    },
});
