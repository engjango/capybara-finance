import styled from '@emotion/styled';

export * from './bar';
export * from './breakdown';
export * from './data';

export const SummarySection = styled('div')({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
    flexGrow: 1,
    height: 'min-content',
    width: '100%',
    //padding: '0 36px 0 0',

    '@media screen and (min-width: 1024px)': {
        '& > div:first-of-type': {
            flex: '300px 0 0',
        },
        '& > div:last-child': {
            flexGrow: 1,
            marginLeft: '16px',
        },
    },

    '@media screen and (max-width: 1024px)': {
        paddingRight: '16px',
        display: 'grid',
        background: 'black',
    },
    '@media screen and (max-width: 768px)': {
        padding: '0 8px 0 0',
    },
});
