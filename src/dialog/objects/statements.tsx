import styled from '@emotion/styled';
import { Description, KeyboardArrowDown } from '@mui/icons-material';
import { Button, List, ListItemText, ListSubheader, MenuItem, Typography, typographyClasses } from '@mui/material';
import { groupBy, toPairs } from 'lodash';
import { DateTime } from 'luxon';
import React, { useMemo } from 'react';
import { NonIdealState } from '../../components/display/NonIdealState';
import { getStatementIcon, useGetAccountIcon } from '../../components/display/ObjectDisplay';
import { ManagedDatePicker, ObjectSelector } from '../../components/inputs';
import { withSuppressEvent } from '../../shared/events';
import { CapybaraDispatch } from '../../state';
import { AppSlice } from '../../state/app';
import { useDialogHasWorking, useDialogState } from '../../state/app/hooks';
import { Statement } from '../../state/data';
import {
    useAccountByID,
    useAccountMap,
    useAllAccounts,
    useAllStatements,
    useInstitutionMap,
} from '../../state/data/hooks';
import { PLACEHOLDER_STATEMENT_ID } from '../../state/data/shared';
import { parseDate } from '../../state/shared/values';
import { Greys } from '../../styles/colours';
import { DialogContents, DialogMain, DialogOptions, EditValueContainer } from '../shared';
import { DialogObjectOptionsBox, DialogSelectorAddNewButton, ObjectEditContainer, getUpdateFunctions } from './shared';
import { useLanguage } from '../../languages/languages-context';

export const DialogStatementView: React.FC = () => {
    const working = useDialogHasWorking();
    const { language, translations } = useLanguage();
    return (
        <DialogMain onClick={remove}>
            <StatementDialogObjectSelector render={render} />
            <DialogContents>
                {working ? (
                    <EditStatementView />
                ) : (
                    <NonIdealState
                        icon={Description}
                        title={translations[language].statements}
                        subtitle={translations[language].statementsDesc}
                    />
                )}
            </DialogContents>
        </DialogMain>
    );
};

const render = (statement: Statement) => (
    <StatementBox>
        {getStatementIcon(statement, FilledStatementIconSx, true)}
        <ListItemText secondary={parseDate(statement.date).toLocaleString(DateTime.DATE_MED)}>
            <Typography noWrap={true}>{statement.name}</Typography>
        </ListItemText>
    </StatementBox>
);

const goToStatementImport = () => CapybaraDispatch(AppSlice.actions.setDialogPage('import'));

const StatementDialogObjectSelector: React.FC<{ render: (statement: Statement) => JSX.Element }> = ({ render }) => {
    const selected = useDialogState('statement', object => object?.id);
    const statements = useAllStatements();
    const options = useMemo(() => {
        const filtered = statements.filter(({ id }) => id !== PLACEHOLDER_STATEMENT_ID);
        const grouped = groupBy(filtered, ({ account }) => account);
        return toPairs(grouped);
    }, [statements]);
    const institutions = useInstitutionMap();
    const accounts = useAccountMap();

    return (
        <DialogOptions>
            <DialogObjectOptionsBox>
                <List subheader={<div />}>
                    {options.map(group => (
                        <SelectorContainerBox key={group[0]}>
                            <SelectorListSubheader>
                                {institutions[accounts[group[0]]!.institution]!.name} - {accounts[group[0]]!.name}
                            </SelectorListSubheader>
                            {group[1].map(option => (
                                <SelectorMenuItem
                                    key={option.id}
                                    selected={option.id === selected}
                                    onClick={withSuppressEvent<HTMLLIElement>(() => set(option))}
                                >
                                    {render(option)}
                                </SelectorMenuItem>
                            ))}
                        </SelectorContainerBox>
                    ))}
                </List>
            </DialogObjectOptionsBox>
            <DialogSelectorAddNewButton type="statement" onClick={goToStatementImport} />
        </DialogOptions>
    );
};

const EditStatementView: React.FC = () => {
    const working = useDialogState('statement')!;

    const getAccountIcon = useGetAccountIcon();
    const account = useAccountByID(working.account);
    const accounts = useAllAccounts();

    const { language, translations } = useLanguage();

    return (
        <ObjectEditContainer type="statement">
            <EditValueContainer label={translations[language].date}>
                <ManagedDatePicker
                    value={working.date}
                    onChange={updateWorkingDate}
                    nullable={false}
                    disableFuture={true}
                    disableOpenPicker={true}
                    slotProps={{
                        textField: { size: 'small', label: translations[language].date },
                    }}
                />
            </EditValueContainer>
            <EditValueContainer label={translations[language].account}>
                <ObjectSelector
                    options={accounts}
                    render={institution => getAccountIcon(institution, IconSx)}
                    selected={working.account}
                    setSelected={updateWorkingAccount}
                >
                    <AccountButton variant="outlined" color="inherit">
                        {getAccountIcon(account, IconSx)}
                        <Typography variant="body1" noWrap={true}>
                            {account.name}
                        </Typography>
                        <KeyboardArrowDown fontSize="small" htmlColor={Greys[600]} />
                    </AccountButton>
                </ObjectSelector>
            </EditValueContainer>
        </ObjectEditContainer>
    );
};

const { update, remove, set } = getUpdateFunctions('statement');
const updateWorkingDate = update('date');
const updateWorkingAccount = update('account');

const IconSx = {
    width: 24,
    height: 24,
    marginRight: 10,
    borderRadius: '4px',
};

const AccountButton = styled(Button)({
    textTransform: 'inherit',
    height: 40,

    '& > svg': { marginLeft: 15 },
});

const StatementBox = styled('div')({
    display: 'flex',
    alignItems: 'center',
    minWidth: 0,
    flexShrink: 1,

    [`& .${typographyClasses.root}`]: {
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
    },
});

const FilledStatementIconSx = {
    height: 34,
    width: 34,
    marginRight: 15,
};

const SelectorContainerBox = styled('div')({
    color: '#fff',
    background: '#242020',
    '@media screen and (max-width: 768px)': {
        background: '#242020',
    },
});

const SelectorListSubheader = styled(ListSubheader)({
    color: '#fff',
    background: 'linear-gradient(0deg, #080707, #242020)',
});

const SelectorMenuItem = styled(MenuItem)({
    padding: '6px 16px',
    width: '100%',
});
