import styled from '@emotion/styled';
import { Button, MenuItem, StepContent, TextField, Tooltip, Typography } from '@mui/material';
import { SubItemCheckbox } from '../../../components/inputs';
import { handleTextFieldChange } from '../../../shared/events';
import { DialogStatementMappingState } from '../../../state/app/statementTypes';
import { useAllCurrencies } from '../../../state/data/hooks';
import {
    canChangeStatementMappingCurrencyType,
    canGoToStatementImportScreen,
    changeStatementMappingCurrencyField,
    changeStatementMappingCurrencyType,
    changeStatementMappingCurrencyValue,
    changeStatementMappingFlipValue,
    changeStatementMappingValue,
    goBackToStatementParsing,
    goToStatementImportScreen,
} from '../../../state/logic/statement';
import { StatementMappingColumns } from '../../../state/logic/statement/parsing';
import { Greys } from '../../../styles/colours';
import { DialogImportActionsBox, DialogImportOptionsContainerBox } from './shared';
import { CustomTextField } from '../../../styles/theme';
import { useLanguage } from '../../../languages/languages-context';

export const DialogImportMappingStepContent: React.FC<{ state: DialogStatementMappingState }> = ({ state }) => {
    const currencies = useAllCurrencies();
    const canProgressToImportScreen = canGoToStatementImportScreen(state, currencies);
    const { language, translations } = useLanguage();

    const NullColumnMenuItem = (
        <MenuItem
            value=""
            sx={{
                color: '#67656a',
                fontStyle: 'italic',
            }}
        >
            {translations[language].none}
        </MenuItem>
    );

    return (
        <StepContent>
            <DialogImportOptionsContainerBox>
                <MappingColumnTextField
                    select={true}
                    value={state.mapping.date}
                    onChange={onChangeMappingDate}
                    size="small"
                    label={translations[language].transactionDate}
                >
                    {state.columns.common
                        .filter(
                            ({ type, nullable, id }) =>
                                type === 'date' &&
                                !nullable &&
                                id !== (state.mapping.currency as { column: string }).column
                        )
                        .map(({ id, name }) => (
                            <MenuItem key={id} value={id}>
                                {name}
                            </MenuItem>
                        ))}
                </MappingColumnTextField>
                <MappingColumnTextField
                    select={true}
                    value={state.mapping.reference || ''}
                    onChange={onChangeMappingReference}
                    size="small"
                    label={translations[language].transactionRef}
                >
                    {state.columns.common
                        .filter(({ type }) => type === 'string')
                        .map(({ id, name }) => (
                            <MenuItem key={id} value={id}>
                                {name}
                            </MenuItem>
                        ))}
                    {NullColumnMenuItem}
                </MappingColumnTextField>
                <MappingColumnTextField
                    select={true}
                    value={state.mapping.balance || ''}
                    onChange={onChangeMappingBalance}
                    size="small"
                    label={translations[language].accountBalance}
                >
                    {state.columns.common
                        .filter(({ type }) => type === 'number')
                        .map(({ id, name }) => (
                            <MenuItem key={id} value={id}>
                                {name}
                            </MenuItem>
                        ))}
                    {NullColumnMenuItem}
                </MappingColumnTextField>
                <MappingColumnHeaderBox>
                    <Typography variant="subtitle2">{translations[language].transactionValues}</Typography>
                    <Tooltip title={translations[language].splitCreditDebitColumns}>
                        <div>
                            <SubItemCheckbox
                                checked={state.mapping.value.type === 'split'}
                                label={translations[language].split}
                                setChecked={changeMappingValueSplit}
                            />
                        </div>
                    </Tooltip>
                </MappingColumnHeaderBox>
                {state.mapping.value.type === 'split' ? (
                    <>
                        <MappingColumnTextField
                            select={true}
                            value={state.mapping.value.credit || ''}
                            onChange={onChangeMappingCredit}
                            size="small"
                            label={translations[language].transactionCredits}
                        >
                            {state.columns.common
                                .filter(({ type }) => type === 'number')
                                .map(({ id, name }) => (
                                    <MenuItem key={id} value={id}>
                                        {name}
                                    </MenuItem>
                                ))}
                            {NullColumnMenuItem}
                        </MappingColumnTextField>
                        <MappingColumnTextField
                            select={true}
                            value={state.mapping.value.debit || ''}
                            onChange={onChangeMappingDebit}
                            size="small"
                            label={translations[language].transactionDebts}
                        >
                            {state.columns.common
                                .filter(({ type }) => type === 'number')
                                .map(({ id, name }) => (
                                    <MenuItem key={id} value={id}>
                                        {name}
                                    </MenuItem>
                                ))}
                            {NullColumnMenuItem}
                        </MappingColumnTextField>
                    </>
                ) : (
                    <MappingColumnTextField
                        select={true}
                        value={state.mapping.value.value || ''}
                        onChange={onChangeMappingValue}
                        size="small"
                        label={translations[language].transactionValue}
                    >
                        {state.columns.common
                            .filter(({ type }) => type === 'number')
                            .map(({ id, name }) => (
                                <MenuItem key={id} value={id}>
                                    {name}
                                </MenuItem>
                            ))}
                        {NullColumnMenuItem}
                    </MappingColumnTextField>
                )}
                <SubItemCheckbox
                    checked={state.mapping.value.flip}
                    setChecked={changeStatementMappingFlipValue}
                    label={
                        state.mapping.value.type === 'value'
                            ? translations[language].flipValues
                            : translations[language].flipDebts
                    }
                    disabled={
                        (state.mapping.value.type === 'value'
                            ? state.mapping.value.value
                            : state.mapping.value.debit) === undefined
                    }
                    sx={FlipValuesCheckboxSx}
                    left={true}
                />
                <MappingColumnHeaderBox>
                    <Typography variant="subtitle2">{translations[language].currencies}</Typography>
                    <Tooltip
                        title={
                            canChangeStatementMappingCurrencyType()
                                ? translations[language].currencyFromStatementColumn
                                : translations[language].noAvailableStringColumns
                        }
                    >
                        <div>
                            <SubItemCheckbox
                                disabled={!canChangeStatementMappingCurrencyType()}
                                checked={state.mapping.currency.type === 'column'}
                                label={translations[language].variable}
                                setChecked={changeStatementMappingCurrencyType}
                            />
                        </div>
                    </Tooltip>
                </MappingColumnHeaderBox>
                {state.mapping.currency.type === 'constant' ? (
                    <MappingColumnTextField
                        select={true}
                        value={state.mapping.currency.currency}
                        onChange={onChangeCurrencyValue}
                        size="small"
                        label={translations[language].transactionCurrency}
                    >
                        {currencies.map(({ id, ticker }) => (
                            <MenuItem key={id} value={id}>
                                {ticker}
                            </MenuItem>
                        ))}
                    </MappingColumnTextField>
                ) : (
                    <>
                        <MappingColumnTextField
                            select={true}
                            value={state.mapping.currency.column}
                            onChange={onChangeCurrencyColumn}
                            size="small"
                            label={translations[language].currencyColumn}
                        >
                            {state.columns.common
                                .filter(({ type, nullable }) => type === 'string' && !nullable)
                                .map(({ id, name }) => (
                                    <MenuItem key={id} value={id}>
                                        {name}
                                    </MenuItem>
                                ))}
                        </MappingColumnTextField>
                        <MappingColumnTextField
                            select={true}
                            value={state.mapping.currency.field}
                            onChange={onChangeCurrencyField}
                            size="small"
                            label={translations[language].matchingCurrencyField}
                        >
                            <MenuItem value="ticker">{translations[language].ticker}</MenuItem>
                            <MenuItem value="symbol">{translations[language].symbol}</MenuItem>
                            <MenuItem value="name">{translations[language].name}</MenuItem>
                        </MappingColumnTextField>
                    </>
                )}
            </DialogImportOptionsContainerBox>
            <DialogImportActionsBox>
                <Button color="error" variant="outlined" size="small" onClick={goBackToStatementParsing}>
                    {translations[language].back}
                </Button>
                <Tooltip title={canProgressToImportScreen || ''}>
                    <div>
                        <Button
                            variant="contained"
                            size="small"
                            disabled={canProgressToImportScreen !== null}
                            onClick={goToStatementImportScreen}
                        >
                            {translations[language].filterRows}
                        </Button>
                    </div>
                </Tooltip>
            </DialogImportActionsBox>
        </StepContent>
    );
};

const getOnChangeMapping = (key: keyof typeof StatementMappingColumns) =>
    handleTextFieldChange((value: string) => changeStatementMappingValue(key, value || undefined));
const onChangeMappingDate = getOnChangeMapping('date');
const onChangeMappingReference = getOnChangeMapping('reference');
const onChangeMappingBalance = getOnChangeMapping('balance');
const changeMappingValueSplit = (split: boolean) => changeStatementMappingValue(split ? 'credit' : 'value', undefined);
const onChangeMappingValue = getOnChangeMapping('value');
const onChangeMappingCredit = getOnChangeMapping('credit');
const onChangeMappingDebit = getOnChangeMapping('debit');
const onChangeCurrencyValue = handleTextFieldChange((value: string) =>
    changeStatementMappingCurrencyValue(Number(value))
);
const onChangeCurrencyColumn = getOnChangeMapping('currency');
const onChangeCurrencyField = handleTextFieldChange(changeStatementMappingCurrencyField as (value: string) => void);

const MappingColumnTextField = styled(CustomTextField)({ width: 220, marginTop: 10 });

const MappingColumnHeaderBox = styled('div')({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 15,
    width: 220,
});

const FlipValuesCheckboxSx = { margin: 0 };
