import { Box, Typography } from '@mui/material';
import { FCWithChildren } from '../../shared/types';
import { Greys } from '../../styles/colours';

export const SettingsDialogPage: FCWithChildren<{ title: string }> = ({ title, children }) => (
    <Box
        sx={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            overflow: 'auto',
        }}
    >
        <Typography variant="h6" sx={{ marginBottom: '8px', color: '#fff' }}>
            {title}
        </Typography>
        <div style={{ padding: '4px' }}>{children}</div>
    </Box>
);

export const SettingsDialogDivider: React.FC = () => {
    return <Box sx={{ height: '1px', width: "61.8%", margin: "8px", }} />;
    {
        /*<Box sx={{ background: "#080707", height: '1px', width: '61.8%', margin: '8px auto 8px auto' }} />*/
    }
};

export const SettingsDialogContents: FCWithChildren = ({ children }) => (
    <Box
        sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            overflowY: 'auto',
            overflowX: 'hidden',
            flex: '1 1 0',
        }}
    >
        {children}
    </Box>
);
