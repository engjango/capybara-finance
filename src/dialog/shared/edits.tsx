import styled from '@emotion/styled';
import { Tooltip, Typography } from '@mui/material';
import { Box, SxProps } from '@mui/system';
import React from 'react';
import { FCWithChildren } from '../../shared/types';
import { Greys } from '../../styles/colours';

export const EditValueContainer: FCWithChildren<{ label?: React.ReactNode; disabled?: string; sx?: SxProps }> = ({
    label,
    children,
    disabled,
    sx,
}) => {
    return (
        <Tooltip title={disabled || ''}>
            <OuterBox>
                <ContainerBox sx={disabled ? (sx ? { ...sx, ...DisabledContainerSx } : DisabledContainerSx) : sx}>
                    <LabelContainerBox>
                        {typeof label === 'string' ? (
                            <LabelTypography variant="subtitle2" noWrap={true}>
                                {label}
                            </LabelTypography>
                        ) : (
                            label
                        )}
                    </LabelContainerBox>
                    {children}
                </ContainerBox>
            </OuterBox>
        </Tooltip>
    );
};

const ContainerBox = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    margin: '3px',
    color: '#fff',
    '@media screen and (max-width: 768px)': {
        display: 'grid',
    }
});

const DisabledContainerSx = {
    pointerEvents: 'none',
    opacity: 0.3,
} as const;

const OuterBox = styled('div')({
    margin: '15px 0',        
    '&:first-of-type': { marginTop: 10 },
    '&:last-child': { marginBottom: 10 },
});

const LabelContainerBox = styled('div')({
    flex: '0 0 150px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: '30px',    
    '@media screen and (max-width: 768px)': {
        flex: '0 0 100px',
        paddingRight: '0',
    }
});

const LabelTypography = styled(Typography)({
    color: '#fff',
    textTransform: 'uppercase',
});

export const EditTitleContainer: React.FC<{ title: string }> = ({ title }) => (
    <EditValueContainer label="" sx={TitleSx}>
        <Typography variant="overline">{title}</Typography>
    </EditValueContainer>
);

const TitleSx = {
    color: Greys[600],
    textTransform: 'uppercase',
    marginTop: 20,
} as const;
