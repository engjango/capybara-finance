import { Typography } from '@mui/material';
import chroma from 'chroma-js';
import React from 'react';
import { IconType } from '../../shared/types';
import { Intents } from '../../styles/colours';
import { NonIdealContainerBox, NonIdealIconSx, NonIdealSubtitleTypography } from '../../styles/theme';

interface NonIdealStateProps {
    icon: IconType;
    title: string;
    intent?: keyof typeof Intents;
    subtitle?: React.ReactNode;
    action?: React.ReactNode;
}
export const NonIdealState: React.FC<NonIdealStateProps> = ({ icon: Icon, title, subtitle, intent, action }) => (
    <NonIdealContainerBox>
        <Icon
            htmlColor={chroma(Intents[intent || 'default'].light)
                .alpha(0.5)
                .hex()}
            sx={NonIdealIconSx}
        />
        <Typography variant="h6">{title}</Typography>
        {subtitle ? (
            typeof subtitle === 'string' ? (
                <NonIdealSubtitleTypography variant="body2">{subtitle}</NonIdealSubtitleTypography>
            ) : (
                subtitle
            )
        ) : undefined}
        {action}
    </NonIdealContainerBox>
);
