import styled from '@emotion/styled';
import { KeyboardArrowDown } from '@mui/icons-material';
import { Button, Typography } from '@mui/material';
import React from 'react';
import { useGetAccountIcon } from '../../components/display/ObjectDisplay';
import { ObjectSelector } from '../../components/inputs';
import { useDialogState } from '../../state/app/hooks';
import { useAllAccounts } from '../../state/data/hooks';
import { changeStatementDialogAccount } from '../../state/logic/statement';
import { Greys } from '../../styles/colours';
import { useLanguage } from '../../languages/languages-context';

export const DialogImportAccountSelector: React.FC = () => {
    const account = useDialogState('import', state => state.account);
    const accounts = useAllAccounts();
    const getAccountIcon = useGetAccountIcon();
    const { language, translations } = useLanguage();

    return (
        <ObjectSelector
            options={accounts}
            render={account => getAccountIcon(account, IconSx)}
            selected={account?.id}
            setSelected={changeStatementDialogAccount}
            placeholder={
                <>
                    {getAccountIcon(undefined, IconSx)}
                    <Typography variant="body1" noWrap={true} sx={PlaceholderSx}>
                        {translations[language].enterAccount}
                    </Typography>
                </>
            }
        >
            <AccountContainerBox>
                <AccountButton variant="outlined" color={account === undefined ? 'error' : 'inherit'}>
                    {getAccountIcon(account, IconSx)}
                    <AccountButtonTypography
                        variant="body1"
                        noWrap={true}
                        sx={account === undefined ? PlaceholderSx : undefined}
                    >
                        {account?.name ||  translations[language].enterAccount}
                    </AccountButtonTypography>
                    <KeyboardArrowDown fontSize="small" htmlColor={"#67656a"} />
                </AccountButton>
            </AccountContainerBox>
        </ObjectSelector>
    );
};

const AccountContainerBox = styled('div')({ margin: '12px 15px' });
const IconSx = {
    height: 20,
    width: 20,
    borderRadius: '4px',
    marginRight: 15,
};
const AccountButton = styled(Button)({
    height: 40,
    width: '100%',
    textTransform: 'inherit',
    color: 'inherit',
});
const AccountButtonTypography = styled(Typography)({ flexGrow: 1, textAlign: 'left' });
const PlaceholderSx = {
    fontStyle: 'italic',
    color: "#67656a",
};
