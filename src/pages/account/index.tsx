import styled from '@emotion/styled';
import { useMemo } from 'react';
import { Page, SECTION_MARGIN } from '../../components/layout';
import { TransactionsTable } from '../../components/table';
import { TransactionsTableFilters, TransactionsTableState } from '../../components/table/table/types';
import { CapybaraDispatch } from '../../state';
import { AppSlice } from '../../state/app';
import { useAccountPageAccount, useAccountPageState } from '../../state/app/hooks';
import { AccountPageBalances } from './balances';
import { AccountPageHeader } from './header';
import { AccountStatementTable } from './statements';
import { useLanguage } from '../../languages/languages-context';

const MiddleBox = styled('div')({
    display: 'flex',

    '& > div:first-of-type': {
        flex: '2 0 700px',
        marginRight: '16px',
    },

    '& > div:last-child': {
        flex: '1 1 300px',
    },

    '@media screen and (max-width: 1024px)': {
        flexDirection: 'column',

        '& > div:first-of-type': {
            flex: '2 0 700px',
            marginRight: 0,
        },

        '& > div:last-child': {
            flex: '1 1 300px',
        },
    },
    '@media screen and (max-width: 768px)': {
        flexDirection: 'column',

        '& > div:first-of-type': {
            flex: '2 0 700px',
        },

        '& > div:last-child': {
            flex: '1 1 300px',
        },
    },
});

export const AccountPage: React.FC = () => {
    const account = useAccountPageAccount();
    const table = useAccountPageState(state => state.table);
    const id = account?.id ?? -1; // Continue hooks in case Account is deleted while on page
    const fixed = useMemo(() => ({ type: 'account' as const, account: id }), [id]);
    const { language, translations } = useLanguage();

    // "table" is only undefined when redirecting to AccountsPage after deletion
    const filters = useMemo(() => ({ ...table?.filters, account: [id] }), [table?.filters, id]);

    if (!account) {
        CapybaraDispatch(AppSlice.actions.setPage('accounts'));
        return <Page title={translations[language].account} />;
    }

    return (
        <Page title={translations[language].account}>
            <AccountContainerBox>
                <AccountPageHeader />
                <div style={{ height: '36px', width: '36px' }} />
                <MiddleBox>
                    <AccountPageBalances />
                    <AccountStatementTable />
                </MiddleBox>
                <div style={{ height: '36px', width: '36px' }} />
                <TransactionsTable
                    filters={filters}
                    state={table.state}
                    setFilters={setFilters}
                    setState={setState}
                    fixed={fixed}
                />
            </AccountContainerBox>
        </Page>
    );
};

const AccountContainerBox = styled('div')({
    marginRight: '36px',
    '@media screen and (max-width: 1024px)': {
        marginRight: '16px',
    },
    '@media screen and (max-width: 768px)': {
        marginRight: '8px',
    },
});

const setFilters = (filters: TransactionsTableFilters) =>
    CapybaraDispatch(AppSlice.actions.setAccountTableStatePartial({ filters }));

const setState = (state: TransactionsTableState) =>
    CapybaraDispatch(AppSlice.actions.setAccountTableStatePartial({ state }));
