import styled from '@emotion/styled';
import { Camera, PhonelinkErase } from '@mui/icons-material';
import { Button, CircularProgress, Dialog, Link, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useCallback, useEffect, useState } from 'react';
import { NonIdealState } from '../components/display/NonIdealState';
import { CapybaraDispatch } from '../state';
import { DataSlice } from '../state/data';
import { useUserData } from '../state/data/hooks';
import { importJSONData } from '../state/logic/import';
import { initialiseDemoData } from '../state/logic/startup';
import { AppColours, WHITE } from '../styles/colours';
import { useLanguage } from '../languages/languages-context';

//export const MIN_WIDTH_FOR_APPLICATION = 1280;

export const CapybaraTutorial: React.FC = () => {
    const open = useUserData(user => user.tutorial);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (open) setLoading(false);
    }, [open]);

    const startDemo = useCallback(() => {
        setLoading(true);
        setTimeout(initialiseDemoData, 0);
    }, []);

    const [width, setWidth] = useState(9001);
    useEffect(() => {
        const observer = new ResizeObserver(entries => setWidth(entries[0].contentRect.width));
        observer.observe(document.body);
        return () => observer.disconnect();
    }, [setWidth]);
    const [widthDismissed, setWidthDismissed] = useState(false);
    //const dismissWidth = useCallback(() => setWidthDismissed(true), []);
    const { language, translations } = useLanguage();

    return (
        <Dialog open={open} maxWidth="md" fullWidth={true}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    minHeight: 0,
                    background: '#242020',
                }}
            >
                <Box sx={{ flex: '1 1 16px' }} />
                <Box
                    sx={{
                        background: AppColours.summary.main,
                        borderRadius: '50%',
                        width: 52,
                        height: 52,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginBottom: 10,
                    }}
                >
                    <Camera
                        htmlColor={WHITE}
                        sx={{
                            width: 30,
                            height: 30,
                            strokeWidth: 1,
                        }}
                    />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 500, color: '#fff', fontSize: '2rem' }}>
                    {translations[language].welcomeTo}
                </Typography>
                <Box sx={{ flex: '1 1 16px' }} />
                <Box sx={{ margin: '0 16px', textAlign: 'center' }}>
                    <SubtitleTypography variant="body1">{translations[language].welcomeSub}</SubtitleTypography>
                    <Typography variant="body1" sx={{ fontWeight: 400, fontSize: '1.1rem', color: '#67646a' }}>
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
                <Box sx={{ flex: '1 1 32px' }} />
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '16px',
                    }}
                >
                    <Button color="app" variant="outlined" onClick={closeTutorial} sx={{ height: 40 }}>
                        {translations[language].startFresh}
                    </Button>
                    <Button
                        size="large"
                        color="app"
                        variant="contained"
                        sx={{ height: 55, margin: '0 40px', background: 'linear-gradient(90deg, #9f55ff, #7000ff)' }}
                        onClick={startDemo}
                    >
                        {loading ? (
                            <Box sx={{ transform: 'scale(0.3)', transformOrigin: 'center' }}>
                                <CircularProgress size="small" sx={{ color: WHITE }} />
                            </Box>
                        ) : (
                            translations[language].beginDemo
                        )}
                    </Button>
                    <label>
                        <Button color="app" variant="outlined" sx={{ height: 40 }} component="div">
                            {translations[language].uploadData}
                        </Button>
                        <input
                            type="file"
                            style={{
                                // This stub value is so Safari doesn't render the button list weirdly
                                width: 0.000001,
                                height: 0,
                            }}
                            accept=".json"
                            onChange={handleFileChange}
                        />
                    </label>
                </Box>
                <Box sx={{ flex: '1 1 90px' }} />
            </Box>
        </Dialog>
    );
};

const closeTutorial = () => CapybaraDispatch(DataSlice.actions.updateUserPartial({ tutorial: false }));

const ImportFileReader = new FileReader();

ImportFileReader.onload = event => importJSONData(event.target!.result as string);

const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    const file = (event.target.files || [])[0];
    if (!file) return;
    ImportFileReader.readAsText(file);
};

const SubtitleTypography = styled(Typography)({
    textAlign: 'center',
    margin: '8px 32px 16px 32px',
    color: '#fff',
    fontWeight: 400,
    fontSize: '1.5rem',
});
