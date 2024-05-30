import styled from '@emotion/styled';
import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { NBSP } from '../../shared/constants';
import { IconType } from '../../shared/types';
import { AppColours, Greys, Intents, WHITE } from '../../styles/colours';

interface SummaryNumberProps {
    icon: IconType;
    primary: {
        value: string;
        positive: boolean | null;
    };
    secondary?: {
        value: string;
        positive: boolean | null;
    };
    subtext: string;
}
export const SummaryNumber: React.FC<SummaryNumberProps> = ({ icon: Icon, primary, secondary, subtext }) => (
    <SummaryNumberContainerBox>
        <Icon
            sx={IconSx}
            style={{
                color: '#fff',
                background:
                    primary.positive === null
                        ? 'linear-gradient(90deg, #9f55ff, #7000ff)'
                        : primary.positive
                        ? 'linear-gradient(90deg, #0f9960, #7000ff)'
                        : 'linear-gradient(90deg, #db3737, #7000ff)',
            }}
            fontSize="small"
        />
        <div>
            <Typography
                variant="h6"
                style={{
                    color: primary.positive === null ? '#fff' : primary.positive ? '#fff' : '#fff',
                    lineHeight: 1,
                }}
            >
                {primary.value}
            </Typography>
            <Box display="flex">
                {secondary ? (
                    <Typography
                        variant="caption"
                        style={{
                            color: secondary.positive === null ? '#080707' : secondary.positive ? "#0f9960" : '#db3737',
                            fontWeight: 500,
                        }}
                    >
                        {secondary.value + NBSP}
                    </Typography>
                ) : undefined}
                <Typography variant="caption" style={{ color: '#fff' }}>
                    {subtext}
                </Typography>
            </Box>
        </div>
    </SummaryNumberContainerBox>
);

const SummaryNumberContainerBox = styled('div')({
    color: 'white',
    display: 'flex',
    width: '100%',
    gap: '32px',
    gridGap: '32px',
    padding: '16px 24px',
    background: 'linear-gradient(90deg, rgba(159,85,255,0.4), rgba(112,0,255,0.4), #242020)',
    borderRadius: '8px',
    margin: '8px',    
});

const IconSx = {
    width: 38,
    height: 38,
    padding: 9,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '50%',
    marginRight: 12,
};
