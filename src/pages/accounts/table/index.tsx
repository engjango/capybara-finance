import { FormControlLabel, Switch } from '@mui/material';
import React from 'react';
import { Section } from '../../../components/layout';
import { CapybaraDispatch } from '../../../state';
import { AppSlice } from '../../../state/app';
import { useAccountsPageState } from '../../../state/app/hooks';
import { useAccountsTableData } from './data';
import { AccountsTableHeader } from './header';
import { AccountsInstitutionDisplay } from './institution';
import { useLanguage } from '../../../languages/languages-context';
import styled from '@emotion/styled';

export const AccountsTable: React.FC = () => {
    const filterInactive = useAccountsPageState(state => state.filterInactive);
    const institutions = useAccountsTableData();
    const { language, translations } = useLanguage();

    return (
        <AccountCardContainer>
            <Section
                title={translations[language].allAccounts}
                headers={
                    <FormControlLabel
                        control={<Switch checked={filterInactive} onChange={handleToggle} />}
                        label={translations[language].filterInactive}
                    />
                }
                emptyBody={true}
            >
                <AccountsTableHeader />
                {institutions.map(institution => (
                    <AccountsInstitutionDisplay key={institution.id} institution={institution} />
                ))}
            </Section>
        </AccountCardContainer>
    );
};

const AccountCardContainer = styled('div')({
    margin: 0,
});

const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) =>
    CapybaraDispatch(AppSlice.actions.setAccountsPagePartial({ filterInactive: event.target.checked }));
