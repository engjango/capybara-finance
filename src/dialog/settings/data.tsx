import styled from '@emotion/styled';
import { Button, CircularProgress, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import JSZip from 'jszip';
import { toPairs } from 'lodash';
import Papa from 'papaparse';
import React, { useCallback, useState } from 'react';
import { createAndDownloadFile } from '../../shared/data';
import { handleTextFieldChange } from '../../shared/events';
import { CapybaraDispatch, CapybaraStore } from '../../state';
import { DataSlice } from '../../state/data';
import { DataKeys } from '../../state/data/types';
import { importJSONData } from '../../state/logic/import';
import { initialiseDemoData } from '../../state/logic/startup';
import { Greys, WHITE } from '../../styles/colours';
import { EditValueContainer } from '../shared';
import { SettingsDialogContents, SettingsDialogDivider, SettingsDialogPage } from './shared';
import { useLanguage } from '../../languages/languages-context';
import { CustomTextField } from '../../styles/theme';

const ActionSx = { textAlign: 'center', width: '100px', height: '61px' } as const;
const ItalicsSx = { fontStyle: 'italic', color: '#67656a', textAlignLast: 'left' } as const;
const InputTextField = styled(TextField)({ margin: '10px 50px 0 50px' });

export const DialogExportContents: React.FC = () => {
    const { language, translations } = useLanguage();
    return (
        <SettingsDialogPage title={translations[language].exportDataToFiles}>
            <Typography variant="body2">{translations[language].exportDataToFilesDesc}</Typography>
            <SettingsDialogDivider />
            <SettingsDialogContents>
                <EditValueContainer
                    label={
                        <Button sx={ActionSx} variant="outlined" onClick={createCSVDownload}>
                            {translations[language].exportCSV}
                        </Button>
                    }
                >
                    <Typography variant="body2" sx={ItalicsSx}>
                        {translations[language].exportCSVDesc}
                    </Typography>
                </EditValueContainer>
                <EditValueContainer
                    label={
                        <Button sx={ActionSx} variant="outlined" onClick={createJSONDownload}>
                            {translations[language].exportJSON}
                        </Button>
                    }
                >
                    <Typography variant="body2" sx={ItalicsSx}>
                        {translations[language].exportJSONDesc}
                    </Typography>
                </EditValueContainer>
            </SettingsDialogContents>
        </SettingsDialogPage>
    );
};

const createJSONDownload = () =>
    createAndDownloadFile('CapybaraData.json', JSON.stringify(CapybaraStore.getState().data));

const createCSVDownload = () => {
    const state = CapybaraStore.getState().data;

    const zip = new JSZip();
    DataKeys.forEach(key => {
        zip.file(
            `${key}.csv`,
            key === 'user'
                ? Papa.unparse(toPairs(state[key]))
                : Papa.unparse(state[key].ids.map(id => state[key].entities[id]!))
        );
    });

    zip.generateAsync({ type: 'blob' }).then(blob => createAndDownloadFile('CapybaraData.zip', blob));
};

export const DialogImportContents: React.FC = () => {
    const { language, translations } = useLanguage();

    const [text, setText] = useState('');

    const ButtonProps = {
        variant: 'outlined',
        color: 'error',
        sx: {
            ...ActionSx,
            color: text.toUpperCase() !== translations[language].permanentlyDeleteAllData ? '#67656a' : '#fff',
            background: text.toUpperCase() !== translations[language].permanentlyDeleteAllData ? '#67656a' : '#242020',
        },
        disabled: text.toUpperCase() !== translations[language].permanentlyDeleteAllData,
    } as const;

    const [demoLoading, setDemoLoading] = useState(false);
    const handleDemoRestart = useCallback(() => {
        setDemoLoading(true);
        setTimeout(
            () =>
                initialiseDemoData().then(() => {
                    setDemoLoading(false);
                }),
            0
        );
    }, [setDemoLoading]);

    return (
        <SettingsDialogPage title={translations[language].importAndWipeData}>
            <Typography variant="body2" style={{ marginBottom: '16px' }}>
                {translations[language].importAndWipeDataDesc1} {translations[language].importAndWipeDataDesc2}
                {' "'}
                <strong>{translations[language].permanentlyDeleteAllData}</strong>
                {'" '}
                {translations[language].importAndWipeDataDesc3}
            </Typography>
            <CustomTextField
                color="error"
                size="small"
                placeholder={translations[language].warningDangerous}
                onChange={handleTextFieldChange(setText)}
            />
            <SettingsDialogDivider />
            <SettingsDialogContents>
                <EditValueContainer
                    label={
                        <Button {...ButtonProps} component="label">
                            {translations[language].importJSON}
                            <input hidden={true} type="file" ref={onCreateFileInput} />
                        </Button>
                    }
                >
                    <Typography variant="body2" sx={ItalicsSx}>
                        {translations[language].importJsonDesc}
                    </Typography>
                </EditValueContainer>
                <EditValueContainer
                    label={
                        <Button
                            {...ButtonProps}
                            onClick={handleDemoRestart}
                            variant={demoLoading ? 'contained' : 'outlined'}
                        >
                            {demoLoading ? (
                                <Box sx={{ transform: 'scale(0.3)', transformOrigin: 'center' }}>
                                    <CircularProgress size="small" sx={{ color: WHITE }} />
                                </Box>
                            ) : (
                                translations[language].restartDemo
                            )}
                        </Button>
                    }
                >
                    <Typography variant="body2" sx={ItalicsSx}>
                        {translations[language].restartDemoDesc}
                    </Typography>
                </EditValueContainer>
                <EditValueContainer
                    label={
                        <Button {...ButtonProps} onClick={deleteAllData}>
                            {translations[language].wipeData}
                        </Button>
                    }
                >
                    <Typography variant="body2" sx={ItalicsSx}>
                        {translations[language].wipeDataDesc}
                    </Typography>
                </EditValueContainer>
            </SettingsDialogContents>
        </SettingsDialogPage>
    );
};

const deleteAllData = () => CapybaraDispatch(DataSlice.actions.reset());

const reader = new FileReader();
reader.onload = () => importJSONData(reader.result as string);
const onCreateFileInput = (input: HTMLInputElement) => {
    if (!input) return;

    input.onchange = () => {
        if (input?.files) reader.readAsText(input.files[0]);
    };
};
