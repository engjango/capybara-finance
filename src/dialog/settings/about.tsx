import { Camera } from '@mui/icons-material';
import { Link, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { AppColours, WHITE } from '../../styles/colours';
import { SettingsDialogPage } from './shared';
import { useLanguage } from '../../languages/languages-context';

export const DialogAboutContents: React.FC = () => {
    const { language, translations } = useLanguage();
    return (
        <SettingsDialogPage title={`${translations[language].aboutThe} Capivara Finanças`}>
            <Box
                sx={{
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    margin: '0 0 8px 0',
                }}
            >
                {/*<Camera htmlColor={WHITE} sx={{ width: 30, height: 30, strokeWidth: 1 }} />*/}
                <img src={'/logo.png'} width={'184px'} style={{ margin: '8px' }} />
            </Box>
            <Box sx={{ margin: '8px', textAlign: 'center' }}>
                <Typography variant="body2" sx={{fontSize: "14px"}}>
                    {translations[language].welcomeDesc}{' '}
                    <Link
                        href="https://github.com/engjango/capybara-finance/blob/main/README.md"
                        underline="hover"
                        target="_blank"
                    >
                        {translations[language].here}
                    </Link>
                    .
                </Typography>
            </Box>
        </SettingsDialogPage>
    );
};
