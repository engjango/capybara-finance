import styled from '@emotion/styled';
import {
    AccountBalance,
    AccountBalanceWallet,
    AddCircleOutline,
    Category,
    Euro,
    Exposure,
    IndeterminateCheckBox,
} from '@mui/icons-material';
import {
    IconButton,
    ListItem,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    ToggleButton,
    ToggleButtonGroup,
    Tooltip,
    Typography,
} from '@mui/material';
import React, { useCallback } from 'react';
import {
    getAccountCategoryIcon,
    getCurrencyIcon,
    getInstitutionIcon,
    useGetAccountIcon,
} from '../../../components/display/ObjectDisplay';
import { FilterIcon, FilterMenuNestedOption, FilterMenuOption, TableHeaderContainer } from '../../../components/table';
import { createNewAccount } from '../../../dialog/objects/accounts';
import { createNewInstitution } from '../../../dialog/objects/institutions';
import { zipObject } from '../../../shared/data';
import { usePopoverProps } from '../../../shared/hooks';
import { CapybaraDispatch } from '../../../state';
import { AppSlice } from '../../../state/app';
import { useAccountsPageState } from '../../../state/app/hooks';
import { ChartSign } from '../../../state/app/pageTypes';
import { useAllAccounts, useAllCurrencies, useAllInstitutions } from '../../../state/data/hooks';
import { AccountTypes } from '../../../state/data/types';
import { ID } from '../../../state/shared/values';
import { useLanguage } from '../../../languages/languages-context';
import {
    AccountInnerBox,
    AccountsBox,
    AccountsTableInstitutionBox,
    ActionMenuItem,
    ActionsBox,
    IconBox,
    InstitutionInnerBox,
} from '../../../styles/theme';

export const AccountsTableHeader: React.FC = () => {
    const popover1 = usePopoverProps();
    const popover2 = usePopoverProps();

    const filters = useAccountsPageState();
    const institutions = useAllInstitutions();
    const accounts = useAllAccounts();
    const currencies = useAllCurrencies();

    const getAccountIcon = useGetAccountIcon();

    const AddNewPopover = usePopoverProps();

    const startAccountCreationCallback = useCallback(() => {
        AddNewPopover.setIsOpen(false);
        startAccountCreation();
    }, [AddNewPopover]);
    const startInstitutionCreationCallback = useCallback(() => {
        AddNewPopover.setIsOpen(false);
        startInstitutionCreation();
    }, [AddNewPopover]);

    const { language, translations } = useLanguage();

    return (
        <TableHeaderContainer>
            <IconBox />
            <AccountsTableInstitutionBox>
                <InstitutionInnerBox>
                    <Typography variant="h6">{translations[language].institution}</Typography>
                    <FilterIcon badgeContent={filters.institution.length} ButtonProps={popover1.buttonProps} />
                    <Menu {...popover1.popoverProps} PaperProps={{ style: { maxHeight: 300, width: 300 } }}>
                        {institutions.map(institution => (
                            <FilterMenuOption
                                key={institution.id}
                                option={institution}
                                select={onSelectIDs['institution']}
                                selected={filters.institution}
                                getOptionIcon={getInstitutionIcon}
                            />
                        ))}
                    </Menu>
                </InstitutionInnerBox>
            </AccountsTableInstitutionBox>
            <AccountsBox>
                <AccountInnerBox>
                    <Typography variant="h6">{translations[language].account}</Typography>
                    <FilterIcon
                        badgeContent={
                            filters.account.length ||
                            filters.type.length ||
                            filters.currency.length ||
                            filters.balances !== 'all'
                        }
                        ButtonProps={popover2.buttonProps}
                    />
                    <Menu
                        {...popover2.popoverProps}
                        PaperProps={{
                            style: {
                                width: 300,
                            },
                        }}
                    >
                        <FilterMenuNestedOption
                            icon={Category}
                            name={translations[language].types}
                            count={filters.type.length}
                            maxHeight={250}
                        >
                            {AccountTypes.map(option => (
                                <FilterMenuOption
                                    key={option.id}
                                    option={option}
                                    select={onSelectIDs['type']}
                                    selected={filters.type}
                                    getOptionIcon={getAccountCategoryIcon}
                                />
                            ))}
                        </FilterMenuNestedOption>
                        <FilterMenuNestedOption
                            icon={Euro}
                            name={translations[language].currencies}
                            count={filters.currency.length}
                            maxHeight={250}
                        >
                            {currencies.map(option => (
                                <FilterMenuOption
                                    key={option.id}
                                    option={option}
                                    select={onSelectIDs['currency']}
                                    selected={filters.currency}
                                    getOptionIcon={getCurrencyIcon}
                                />
                            ))}
                        </FilterMenuNestedOption>
                        <FilterMenuNestedOption
                            icon={AccountBalanceWallet}
                            name={translations[language].accounts}
                            count={filters.account.length}
                            maxHeight={250}
                        >
                            {accounts.map(option => (
                                <FilterMenuOption
                                    key={option.id}
                                    option={option}
                                    select={onSelectIDs['account']}
                                    selected={filters.account}
                                    getOptionIcon={getAccountIcon}
                                />
                            ))}
                        </FilterMenuNestedOption>
                        <ListItem>
                            <ListItemText>{translations[language].balances}</ListItemText>
                            <ToggleButtonGroup
                                size="small"
                                value={filters.balances}
                                exclusive={true}
                                onChange={onSetBalances}
                            >
                                <ToggleButton value="all">
                                    <Tooltip title={translations[language].allAccounts}>
                                        <Exposure fontSize="small" />
                                    </Tooltip>
                                </ToggleButton>
                                <ToggleButton value="credits">
                                    <Tooltip title={translations[language].positiveBalances}>
                                        <AddCircleOutline fontSize="small" />
                                    </Tooltip>
                                </ToggleButton>
                                <ToggleButton value="debits">
                                    <Tooltip title={translations[language].negativeBalances}>
                                        <IndeterminateCheckBox fontSize="small" />
                                    </Tooltip>
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </ListItem>
                    </Menu>
                </AccountInnerBox>
                <ActionsBox>
                    <IconButton size="small" {...AddNewPopover.buttonProps} style={{ color: '#fff' }}>
                        <AddCircleOutline />
                    </IconButton>
                    <Menu
                        {...AddNewPopover.popoverProps}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    >
                        <ActionMenuItem onClick={startAccountCreationCallback}>
                            <ListItemIcon>
                                <AccountBalanceWallet />
                            </ListItemIcon>
                            <ListItemText>{translations[language].newAccount}</ListItemText>
                        </ActionMenuItem>
                        <ActionMenuItem onClick={startInstitutionCreationCallback}>
                            <ListItemIcon>
                                <AccountBalance />
                            </ListItemIcon>
                            <ListItemText>{translations[language].newInstitution}</ListItemText>
                        </ActionMenuItem>
                    </Menu>
                </ActionsBox>
            </AccountsBox>
        </TableHeaderContainer>
    );
};

const filters = ['account', 'institution', 'currency', 'type'] as const;

const onSelectIDs = zipObject(
    filters,
    filters.map(f => (ids: ID[]) => CapybaraDispatch(AppSlice.actions.setAccountsPagePartial({ [f]: ids })))
);

const onSetBalances = (_: any, balances: ChartSign) =>
    CapybaraDispatch(AppSlice.actions.setAccountsPagePartial({ balances }));

const startAccountCreation = () =>
    CapybaraDispatch(AppSlice.actions.setDialogPartial({ id: 'account', account: createNewAccount() }));

const startInstitutionCreation = () =>
    CapybaraDispatch(AppSlice.actions.setDialogPartial({ id: 'institution', institution: createNewInstitution() }));
