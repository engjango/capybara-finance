import styled from '@emotion/styled';
import { AccountBalance } from '@mui/icons-material';
import { Avatar, Button, Card, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useCallback } from 'react';
import { CapybaraDispatch } from '../../../state';
import { AppSlice } from '../../../state/app';
import { PLACEHOLDER_INSTITUTION_ID } from '../../../state/data';
import { AccountTableEntry } from './account';
import { AccountsInstitutionSummary } from './data';
import { useLanguage } from '../../../languages/languages-context';
import { AccountsTableAccountsBox, AccountsTableIconSx, AccountsTableInstitutionBox } from '../../../styles/theme';

const IconAvatar = styled(Avatar)(AccountsTableIconSx);

export const AccountsInstitutionDisplay: React.FC<{ institution: AccountsInstitutionSummary }> = ({ institution }) => {
    const onEditInstitution = useCallback(
        () => CapybaraDispatch(AppSlice.actions.setDialogPartial({ id: 'institution', institution })),
        [institution]
    );
    const { language, translations } = useLanguage();

    return (
        <ContainerCard>
            <IconAvatar src={institution?.icon}>
                <AccountBalance style={{ height: '50%' }} />
            </IconAvatar>
            <AccountsTableInstitutionBox>
                <InstitutionNameTypography
                    variant="h5"
                    sx={institution.id === PLACEHOLDER_INSTITUTION_ID ? PlaceholderInstitutionNameSx : undefined}
                    noWrap={true}
                >
                    {institution.name}
                </InstitutionNameTypography>
                <InstitutionEditActionButton
                    size="small"
                    disabled={institution.id === PLACEHOLDER_INSTITUTION_ID}
                    color="inherit"
                    onClick={onEditInstitution}
                >
                    {translations[language].edit}
                </InstitutionEditActionButton>
            </AccountsTableInstitutionBox>
            <InstitutionColourSquareBox sx={{ backgroundColor: institution.colour }} />
            <AccountsTableAccountsBox>
                {institution.accounts.map(account => (
                    <AccountTableEntry account={account} key={account.id} />
                ))}
            </AccountsTableAccountsBox>
        </ContainerCard>
    );
};

const ContainerCard = styled(Card)({    
    color: '#fff',
    display: 'flex',
    alignItems: 'flex-start',
    position: 'relative',
    marginTop: 27,
    background: '#242020',
    width: '100%',
    '@media screen and (max-width: 1024px)': {
        display: 'grid',
        flexDirection: 'column',
        alignItems: 'center',
        justifyItems: 'center',
    },
    '@media screen and (max-width: 600px)': {
        padding: '10px',
    },
});

const InstitutionColourSquareBox = styled(Box)({
    position: 'absolute',
    width: 320,
    height: 280,
    left: -37.66,
    top: -86.53,
    opacity: 0.1,
    borderRadius: '48px',
    transform: 'rotate(-60deg)',
    pointerEvents: 'none',
    '@media screen and (max-width: 1024px)': {
        width: 160,
        height: 140,
        left: -20,
        top: -40,
    },
    '@media screen and (max-width: 600px)': {
        display: 'none',
    },
});

const InstitutionNameTypography = styled(Typography)({
    lineHeight: 1,
    marginTop: 2,
    width: '100%',
    '@media screen and (max-width: 1024px)': {
        fontSize: '1.2em',
        textAlign: 'center',
    },
    '@media screen and (max-width: 600px)': {
        fontSize: '1em',
    },
});

const PlaceholderInstitutionNameSx = {
    fontStyle: 'italic',
    color: '#fff',
};

const InstitutionEditActionButton = styled(Button)({
    color: '#67656a',
    height: 20,
    minWidth: 40,
    marginTop: 2,
    marginLeft: -5,
    '@media screen and (max-width: 1024px)': {
        marginLeft: 0,
        marginTop: 10,
    },
    '@media screen and (max-width: 600px)': {
        marginTop: 5,
        fontSize: '0.8em',
    },
});
