import styled from '@emotion/styled';
import { NoteAdd } from '@mui/icons-material';
import { Button, Link, Typography } from '@mui/material';
import { alpha, Box } from '@mui/system';
import React, { useContext } from 'react';
import { FileHandlerContext } from '../../app/context';
import { CapybaraDispatch } from '../../state';
import { AppSlice, DefaultPages } from '../../state/app';
import { useDialogState } from '../../state/app/hooks';
import { DialogStatementFileState } from '../../state/app/statementTypes';
import { Greys, Intents } from '../../styles/colours';
import { getThemeTransition } from '../../styles/theme';
import { DialogContents, DialogMain, DialogOptions } from '../shared';
import { DialogImportAccountSelector } from './account';
import { useLanguage } from '../../languages/languages-context';

export const DialogImportFileScreen: React.FC = () => {
    const { openFileDialog, isDragActive } = useContext(FileHandlerContext);
    const rejections = useDialogState('import', state => (state as DialogStatementFileState).rejections);
    const { language, translations } = useLanguage();
    return (
        <DialogMain>
            <DialogOptions>
                <DialogImportAccountSelector />
                <TitleTypography variant="h6">{translations[language].fileUpload}</TitleTypography>
                <DividerBox />
                <BodyTypography variant="body2">{translations[language].importStatementDesc1}</BodyTypography>
                <BodyTypography variant="body2">
                    {translations[language].importStatementDesc2}{' '}
                    <Link onClick={goToTransactionsPage} href="#" underline="hover">
                        {translations[language].theTransactionsPage}
                    </Link>
                    .
                </BodyTypography>
                <UploadButton variant="outlined" onClick={openFileDialog}>
                    {translations[language].fileUpload}
                </UploadButton>
            </DialogOptions>
            <DialogContents>
                <IconBox sx={isDragActive ? ActiveIconBoxSx : undefined}>
                    <NoteAdd />
                    <Typography variant="h6">{translations[language].importStatement}</Typography>
                    <Typography variant="body1" style={{ color: Intents.danger.main }}>
                        {rejections.join(', ')}
                    </Typography>
                </IconBox>
            </DialogContents>
        </DialogMain>
    );
};

const goToTransactionsPage = () => CapybaraDispatch(AppSlice.actions.closeDialogAndGoToPage(DefaultPages.transactions));

const BodyTypography = styled(Typography)({
    color: '#67656a',
    margin: '6px 30px',
});

const UploadButton = styled(Button)({ margin: 'auto 20px 12px 20px' });

const IconBox = styled(Box)({
    margin: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',

    '& > svg': {
        height: 80,
        width: 80,
        padding: 20,
        borderRadius: '50%',
        marginBottom: 15,

        transformOrigin: 'center center',
        color: Greys[500],
        background: Greys[300],

        transition: getThemeTransition(['transform', 'color', 'background']),
    },
    '& > h6': {
        color: Greys[600],
    },
});

const ActiveIconBoxSx = {
    '& > svg': {
        transform: 'scale(1.2)',
        color: Intents.app.main + '!important',
        background: alpha(Intents.app.light, 0.1) + '!important',
    },
    '& > h6': {
        color: Greys[800] + '!important',
    },
};

const TitleTypography = styled(Typography)({
    color: '#67656a',
    margin: '10px 20px 6px 40px',
    fontWeight: 400,
});

const DividerBox = styled('div')({
    height: 1,
    width: '70%',
    marginLeft: 30,
    marginBottom: 10,
    background: Greys[500],
});
