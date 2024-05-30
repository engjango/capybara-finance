import styled from '@emotion/styled';
import { CallSplit, KeyboardArrowDown } from '@mui/icons-material';
import { Autocomplete, Button, Checkbox, ListItemText, Menu, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { identity, inRange, isEqual } from 'lodash';
import React, { useCallback } from 'react';
import { DropResult } from 'react-beautiful-dnd';
import { SingleCategoryMenu } from '../../components/display/CategoryMenu';
import { NonIdealState } from '../../components/display/NonIdealState';
import { getCategoryIcon, useGetAccountIcon } from '../../components/display/ObjectDisplay';
import { SubItemCheckbox } from '../../components/inputs';
import { handleAutoCompleteChange, handleTextFieldChange } from '../../shared/events';
import { useNumericInputHandler, usePopoverProps } from '../../shared/hooks';
import { CapybaraDispatch, CapybaraStore } from '../../state';
import { useDialogHasWorking, useDialogState } from '../../state/app/hooks';
import { Account, Category, DataSlice, Rule } from '../../state/data';
import { useAccountMap, useAllAccounts, useCategoryByID, useRuleByID } from '../../state/data/hooks';
import { getNextID, PLACEHOLDER_CATEGORY_ID } from '../../state/data/shared';
import { Greys } from '../../styles/colours';
import { CustomTextField, getThemeTransition } from '../../styles/theme';
import { DialogContents, DialogMain, EditTitleContainer, EditValueContainer } from '../shared';
import { DraggableDialogObjectSelector, getUpdateFunctions, ObjectEditContainer } from './shared';
import { useLanguage } from '../../languages/languages-context';

export const DialogRulesView: React.FC = () => {
    const working = useDialogHasWorking();
    const { language, translations } = useLanguage();

    return (
        <DialogMain onClick={remove}>
            <DraggableDialogObjectSelector
                type="rule"
                createDefaultOption={createNewRule}
                render={render}
                onDragEnd={onDragEnd}
            />
            <DialogContents>
                {working ? (
                    <EditRuleView />
                ) : (
                    <NonIdealState
                        icon={CallSplit}
                        title={translations[language].rules}
                        subtitle={translations[language].rulesDesc}
                    />
                )}
            </DialogContents>
        </DialogMain>
    );
};

const RuleListBox = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    flexGrow: 1,
    height: 32,

    '& > div:first-of-type': {
        marginLeft: 10,
        color: Greys[500],
        width: 40,
        flexGrow: 0,
    },
});
const InactiveRuleListBoxSx = {
    opacity: 0.5,
    fontStyle: 'italic',
    transition: getThemeTransition('opacity'),
    '&:hover': { opacity: 1 },
};
const render = (rule: Rule) => (
    <RuleListBox sx={rule.isInactive ? InactiveRuleListBoxSx : undefined}>
        <ListItemText>{rule.index + '.'}</ListItemText>
        <ListItemText>{rule.name}</ListItemText>
    </RuleListBox>
);

const createNewRule = (): Rule => {
    const id = getNextID(CapybaraStore.getState().data.rule.ids);
    return {
        id,
        name: 'New Rule',
        index: id,
        isInactive: false,
        reference: [],
        regex: false,
        accounts: [],
        min: null,
        max: null,
        category: PLACEHOLDER_CATEGORY_ID,
    };
};

const onDragEnd = ({ source, destination, reason, draggableId }: DropResult) => {
    if (reason !== 'DROP' || !destination) return;

    const { ids, entities } = CapybaraStore.getState().data.rule;

    const rangeMin = Math.min(source.index, destination.index);
    const rangeMax = Math.max(source.index, destination.index);
    const updates = ids
        .filter(id => inRange(entities[id]!.index, rangeMin, rangeMax + 1) && entities[id]!.index !== source.index)
        .map(id => [id, entities[id]!.index + (source.index > destination.index ? 1 : -1)] as [number, number])
        .concat([[Number(draggableId), destination.index]]);

    CapybaraDispatch(DataSlice.actions.updateRuleIndices(updates));
};

const EditRuleView: React.FC = () => {
    const {language, translations} = useLanguage();

    const working = useDialogState('rule')!;
    const actual = useRuleByID(working.id);

    const category = useCategoryByID(working.category);

    const min = useNumericInputHandler(working.min ?? null, updateWorkingMin, working.id);
    const max = useNumericInputHandler(working.max ?? null, updateWorkingMax, working.id);

    const getAccountIcon = useGetAccountIcon();
    const accounts = useAllAccounts();
    const accountMap = useAccountMap();

    // These dummies are to help ESLint work out the dependencies of the callback
    const setMinValue = min.setValue;
    const setMaxValue = max.setValue;
    const onReset = useCallback(() => {
        const actual = CapybaraStore.getState().data.rule.entities[working.id];
        if (actual) {
            setMinValue(actual.min);
            setMaxValue(actual.max);
        }
    }, [setMinValue, setMaxValue, working.id]);

    const categoryButtonPopover = usePopoverProps();
    const setIsPopoverOpen = categoryButtonPopover.setIsOpen;
    const handleChangeCategory = useCallback(
        (category?: Category) => {
            if (category) {
                updateWorkingCategory(category.id);
                setIsPopoverOpen(false);
            }
        },
        [setIsPopoverOpen]
    );

    return (
        <ObjectEditContainer
            type="rule"
            subtitle={
                <SubItemCheckbox
                    label={translations[language].inactiveRule}
                    checked={working.isInactive}
                    setChecked={updateWorkingIsInactive}
                    sx={InactiveCheckboxSx}
                />
            }
            onReset={onReset}
            actions={
                <Button variant="contained" disabled={!isEqual(working, actual)} onClick={runWorkingRule}>
                    {translations[language].runRule}
                </Button>
            }
        >
            <EditTitleContainer title={translations[language].conditions} />
            <EditValueContainer label={translations[language].reference}>
                <GrowingBox>
                    <Autocomplete
                        limitTags={1}
                        multiple={true}
                        options={[] as string[]}
                        getOptionLabel={identity}
                        value={working.reference}
                        onChange={updateWorkingReferenceAuto}
                        renderInput={params => (
                            <CustomTextField
                                {...params}
                                label={translations[language].transactionReference}
                                size="small"
                                onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
                                    if (event.key === 'Enter') {
                                        updateWorkingReference(
                                            working.reference.concat([(event.target as HTMLInputElement).value])
                                        );
                                        (event.target as HTMLInputElement).value = '';
                                    }
                                }}
                                onBlur={() => {
                                    const { value } = params.inputProps as unknown as HTMLInputElement;
                                    if (value) updateWorkingReference(working.reference.concat([value]));
                                }}
                            />
                        )}
                        open={false}
                    />
                    <SubItemCheckbox
                        label={translations[language].asRegex}
                        checked={working.regex}
                        setChecked={updateWorkingRegex}
                        left={true}
                    />
                </GrowingBox>
            </EditValueContainer>
            <EditValueContainer label={translations[language].value}>
                <RangeBox>
                    <CustomTextField value={min.text} onChange={min.onTextChange} size="small" label={translations[language].minimum} />
                    <CustomTextField value={max.text} onChange={max.onTextChange} size="small" label={translations[language].maximum} />
                </RangeBox>
            </EditValueContainer>
            <EditValueContainer label={translations[language].accounts}>
                <Autocomplete
                    sx={{ flexGrow: 1 }}
                    limitTags={1}
                    multiple={true}
                    options={accounts}
                    getOptionLabel={option => option.name}
                    value={working.accounts.map(id => accountMap[id]!)}
                    autoHighlight={true}
                    onChange={updateWorkingAccounts}
                    renderOption={(props, account) => (
                        <li {...props}>
                            {getAccountIcon(account, AccountIconSx)}
                            <GrowingTypography variant="body1">{account.name}</GrowingTypography>
                            <Checkbox size="small" color="primary" checked={working.accounts.includes(account.id)} />
                        </li>
                    )}
                    renderInput={params => <CustomTextField {...params} label={translations[language].includedAccounts} size="small" />}
                />
            </EditValueContainer>
            <EditTitleContainer title={translations[language].updatedValues} />
            <EditValueContainer label={translations[language].summary}>
                <CustomTextField
                    sx={{ width: 230 }}
                    value={working.summary || ''}
                    onChange={updateWorkingSummary}
                    size="small"
                    label={translations[language].newSummaryText}
                />
            </EditValueContainer>
            <EditValueContainer label={translations[language].description}>
                <CustomTextField
                    value={working.description || ''}
                    onChange={updateWorkingDescription}
                    size="small"
                    label={translations[language].newDescriptionText}
                    sx={{ width: '100%' }}
                    multiline={true}
                />
            </EditValueContainer>
            <EditValueContainer label={translations[language].category}>
                <CategorySelectionButton variant="outlined" color="inherit" {...categoryButtonPopover.buttonProps}>
                    {getCategoryIcon(category, CategoryIconSx)}
                    <Typography variant="body1" noWrap={true}>
                        {category.name}
                    </Typography>
                    <KeyboardArrowDown fontSize="small" htmlColor={Greys[600]} />
                </CategorySelectionButton>
                <Menu {...categoryButtonPopover.popoverProps} PaperProps={CategoryPaperProps}>
                    <SingleCategoryMenu selected={working.category} setSelected={handleChangeCategory} />
                </Menu>
            </EditValueContainer>
        </ObjectEditContainer>
    );
};

const { update, remove, getWorkingCopy } = getUpdateFunctions('rule');
const updateWorkingIsInactive = update('isInactive');
const updateWorkingReference = update('reference');
const updateWorkingReferenceAuto = handleAutoCompleteChange(updateWorkingReference);
const updateWorkingRegex = update('regex');
const updateWorkingMin = update('min');
const updateWorkingMax = update('max');
const updateWorkingAccounts = handleAutoCompleteChange((accounts: Account[]) =>
    update('accounts')(accounts.map(({ id }) => id))
);
const updateWorkingSummary = handleTextFieldChange(update('summary'));
const updateWorkingDescription = handleTextFieldChange(update('description'));
const updateWorkingCategory = update('category');

const runWorkingRule = () => {
    const id = getWorkingCopy().id;
    CapybaraDispatch(DataSlice.actions.runRule(id));
};

const InactiveCheckboxSx = { alignSelf: 'flex-end' };
const GrowingBox = styled('div')({ flexGrow: 1 });
const GrowingTypography = styled(Typography)({ flexGrow: 1 });
const CategoryIconSx = {
    width: 20,
    height: 20,
    marginRight: 15,
    flexShrink: 0,
};
const RangeBox = styled('div')({
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'space-between',

    '& > :first-of-type': {
        marginRight: 30,
    },
});
const AccountIconSx = {
    width: 16,
    height: 16,
    borderRadius: '4px',
    marginRight: 8,
};
const CategorySelectionButton = styled(Button)({
    width: 230,
    textTransform: 'inherit',
    height: 40,

    '& > p': {
        flexGrow: 1,
        textAlign: 'left',
    },

    '& > svg': {
        marginLeft: 15,
    },
});
const CategoryPaperProps = { sx: { width: 230, maxHeight: 300 } };
