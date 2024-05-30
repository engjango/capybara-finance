import styled from '@emotion/styled';
import { Cached, CloudDone, Edit, GetApp, ListAlt, Notifications, PestControl } from '@mui/icons-material';
import { List, ListItemIcon, ListItemText, ListSubheader, MenuItem } from '@mui/material';
import React from 'react';
import { zipObject } from '../../shared/data';
import { withSuppressEvent } from '../../shared/events';
import { CapybaraDispatch } from '../../state';
import { AppSlice, DialogState } from '../../state/app';
import { useDialogState } from '../../state/app/hooks';
import { useUserData } from '../../state/data/hooks';
import { Greys } from '../../styles/colours';
import { DialogContents, DialogMain, DialogOptions } from '../shared';
import { DialogAboutContents } from './about';
import { DialogCurrencyContents } from './currency';
import { DialogExportContents, DialogImportContents } from './data';
import { DialogNotificationsContents } from './notifications';
import { DialogStorageContents } from './storage';
import { DialogSummaryContents } from './summary';
import { DialogDebugContents } from './debug';
import { useLanguage } from '../../languages/languages-context';

export const DialogSettingsView: React.FC = () => {
    const page = useDialogState('settings');
    const isDemo = useUserData(user => user.isDemo);
    const { language, translations } = useLanguage();

    return (
        <DialogMain onClick={setEmptyPage}>
            <DialogOptions>
                <SettingsList>
                    <SettingsSubheader>{translations[language].infoData}</SettingsSubheader>
                    <MenuItem onClick={setPage['summary']} selected={page === 'summary'}>
                        <ListItemIcon>
                            <ListAlt fontSize="small" htmlColor="#fff" />
                        </ListItemIcon>
                        <SettingsListItemText>
                            {isDemo ? translations[language].demo : translations[language].summary}
                        </SettingsListItemText>
                    </MenuItem>
                    <MenuItem onClick={setPage['import']} selected={page === 'import'}>
                        <ListItemIcon>
                            <Edit fontSize="small" htmlColor="#fff" />
                        </ListItemIcon>
                        <SettingsListItemText>{translations[language].manageData}</SettingsListItemText>
                    </MenuItem>
                    <MenuItem onClick={setPage['export']} selected={page === 'export'}>
                        <ListItemIcon>
                            <GetApp fontSize="small" htmlColor="#fff" />
                        </ListItemIcon>
                        <SettingsListItemText>{translations[language].export}</SettingsListItemText>
                    </MenuItem>
                    <MenuItem onClick={setPage['debug']} selected={page === 'debug'}>
                        <ListItemIcon>
                            <PestControl fontSize="small" htmlColor="#fff" />
                        </ListItemIcon>
                        <SettingsListItemText>{translations[language].debug}</SettingsListItemText>
                    </MenuItem>
                    <SettingsSubheader>{translations[language].settings}</SettingsSubheader>
                    <MenuItem onClick={setPage['notifications']} selected={page === 'notifications'}>
                        <ListItemIcon>
                            <Notifications fontSize="small" htmlColor="#fff" />
                        </ListItemIcon>
                        <SettingsListItemText>{translations[language].notifications}</SettingsListItemText>
                    </MenuItem>
                    <MenuItem onClick={setPage['currency']} selected={page === 'currency'}>
                        <ListItemIcon>
                            <Cached fontSize="small" htmlColor="#fff" />
                        </ListItemIcon>
                        <SettingsListItemText>{translations[language].currencySync}</SettingsListItemText>
                    </MenuItem>
                    <MenuItem onClick={setPage['storage']} selected={page === 'storage'}>
                        <ListItemIcon>
                            <CloudDone fontSize="small" htmlColor="#fff" />
                        </ListItemIcon>
                        <SettingsListItemText>{translations[language].storageAndServices}</SettingsListItemText>
                    </MenuItem>
                </SettingsList>
            </DialogOptions>
            <DialogContents>{page ? Pages[page] : <DialogAboutContents />}</DialogContents>
        </DialogMain>
    );
};

const pages = ['summary', 'import', 'export', 'debug', 'storage', 'notifications', 'currency'] as const;
const setPage = zipObject(
    pages,
    pages.map(settings => withSuppressEvent(() => CapybaraDispatch(AppSlice.actions.setDialogPartial({ settings }))))
);
const setEmptyPage = () => CapybaraDispatch(AppSlice.actions.setDialogPartial({ settings: undefined }));

const Pages: Record<NonNullable<DialogState['settings']>, React.ReactNode> = {
    summary: <DialogSummaryContents />,
    import: <DialogImportContents />,
    export: <DialogExportContents />,
    debug: <DialogDebugContents />,
    storage: <DialogStorageContents />,
    notifications: <DialogNotificationsContents />,
    currency: <DialogCurrencyContents />,
};

const SettingsList = styled(List)({
    overflowY: 'auto',
    paddingTop: 0,
    paddingBottom: 0,
    '& > li': {
        paddingLeft: 20,
        paddingRight: 20,
    },
    '@media screen and (max-width: 768px)': {
        margin: '0',
    }
});
const SettingsSubheader = styled(ListSubheader)({
    color: '#67656a',
    background: 'transparent',
    "@media screen and (max-width: 1024px)": {
        background: 'linear-gradient(180deg, #242020, #080707)',
    }
});

const SettingsListItemText = styled(ListItemText)({
    color: '#fff',
    paddingTop: 4,
    paddingBottom: 4,
});
