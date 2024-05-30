import styled from '@emotion/styled';
import { Card, Theme } from '@mui/material';
import { SxProps } from '@mui/system';
import { FCWithChildren } from '../../../shared/types';
import { APP_BACKGROUND_COLOUR } from '../../../styles/theme';

export const TableHeaderContainer: FCWithChildren<{ sx?: SxProps<Theme> }> = ({ children, sx }) => {
    return (
        <ContainerBox>
            <HeaderCard elevation={2} sx={sx}>
                {children}
            </HeaderCard>
        </ContainerBox>
    );
};

const ContainerBox = styled('div')({
    top: 0,
    position: 'sticky',
    backgroundColor: 'transparent',
    zIndex: 2,
    margin: '-20px -10px 5px -10px',
    padding: '8px 8px 0 8px',
    '@media screen and (max-width: 1024px)': {
        //marginRight: '16px',
    }
});

const HeaderCard = styled(Card)({
    color: '#fff',
    height: 50,
    display: 'flex',
    alignItems: 'center',    
    borderRadius: '10px',
    backdropFilter: 'blur(10px)',
    background: 'linear-gradient(90deg, rgba(159,85,244,0.37), rgba(112,0,255,0.37))',
});
