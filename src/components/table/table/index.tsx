import styled from '@emotion/styled';
import { PlaylistAdd } from '@mui/icons-material';
import { Button, Card, Checkbox, Typography } from '@mui/material';
import { noop } from 'lodash';
import React, { useCallback, useMemo } from 'react';
import { TableHeaderContainer } from '..';
import { flipListIncludes } from '../../../shared/data';
import { useRefToValue } from '../../../shared/hooks';
import { ID, parseDate } from '../../../state/shared/values';
import { CapybaraTheme } from '../../../styles/theme';
import { Section, SectionProps } from '../../layout';
import { getAllCommonTransactionValues, useTransactionsTableData } from './data';
import { TransactionsTableEditEntry } from './edit';
import { TransactionsTableHeader } from './header';
import { TransactionTableCompoundContainer, TransactionTableDateContainer, TransactionTableSxProps } from './styles';
import {
   EditTransactionState,
   TransactionsTableFilters,
   TransactionsTableFixedDataState,
   TransactionsTableState,
} from './types';
import { TransactionsTableViewEntry } from './view';
import { useLanguage } from '../../../languages/languages-context';
import { capitalizeFirstLetter } from '../../../shared/utils';

export interface TransactionsTableProps {
   filters: TransactionsTableFilters;
   setFilters: (filter: TransactionsTableFilters) => void;

   state: TransactionsTableState;
   setState: (state: TransactionsTableState) => void;

   fixed?: TransactionsTableFixedDataState;

   headers?: SectionProps['headers'];
}

export const TransactionsTable: React.FC<TransactionsTableProps> = ({
   filters,
   state,
   fixed,

   setFilters,
   setState,

   headers,
}) => {
   const { selection, edit } = state;
   const { ids, groups, metadata, more } = useTransactionsTableData(filters, fixed);

   const [filtersRef, setFiltersPartial] = useSetPartialValue(filters, setFilters);
   const [stateRef, setStatePartial] = useSetPartialValue(state, setState);
   const updaters = useTableUpdateFunctions(stateRef, setStatePartial, filtersRef, setFiltersPartial);

   const { language, translations } = useLanguage();
   const locale = language.toString() || 'pt';

   return (
      <Section title={translations[language].transactionsList} headers={headers} emptyBody={true}>
         <TableHeaderContainer
            sx={{
               ...TransactionTableSxProps.Container,
               ...(selection.length > 0 ? ActiveTableHeaderContainerSx : undefined),
            }}
         >
            <CheckboxContainer>
               <Checkbox
                  indeterminate={!!selection.length && selection.length !== ids.length}
                  checked={!!selection.length}
                  onChange={updaters.selectionHeader(ids)}
                  color="primary"
                  disabled={!!edit}
               />
            </CheckboxContainer>
            {edit && edit.id === undefined ? (
               <TransactionsTableEditEntry
                  original={getAllCommonTransactionValues(selection.map(id => metadata[id]!))}
                  edit={edit}
                  selected={selection}
                  setEditPartial={updaters.editPartial}
                  setStatePartial={setStatePartial}
                  fixed={fixed}
               />
            ) : selection.length ? (
               <TransactionsTableViewEntry
                  transaction={getAllCommonTransactionValues(selection.map(id => metadata[id]!))}
                  updateState={setStatePartial}
                  fixed={fixed}
               />
            ) : (
               <TransactionsTableHeader
                  filters={filters}
                  setFiltersPartial={setFiltersPartial}
                  setEdit={updaters.edit}
                  fixed={fixed}
                  canCreateNew={!edit && selection.length === 0}
               />
            )}
         </TableHeaderContainer>
         {edit?.id !== undefined && !ids.includes(edit.id) ? (
            <RowGroupCard elevation={0}>
               <ContainerBox>
                  <CheckboxContainer>
                     <Checkbox checked={false} onChange={noop} color="primary" disabled={true} />
                  </CheckboxContainer>
                  <TransactionsTableEditEntry
                     edit={edit}
                     selected={[edit.id]}
                     setEditPartial={updaters.editPartial}
                     setStatePartial={setStatePartial}
                     fixed={fixed}
                  />
               </ContainerBox>
            </RowGroupCard>
         ) : undefined}
         {groups.map(([date, list]) => (
            <RowGroupCard key={date} elevation={0}>
               <TransactionTableDateContainer>
                  {date ? (
                     <TransactionTableCompoundContainer>
                        <TextTypography variant="body1">
                           {capitalizeFirstLetter(parseDate(date).setLocale(`${locale}`).toFormat('MMMM, dd'))}
                        </TextTypography>
                        <SubtextTypography variant="caption">{parseDate(date).toFormat('yyyy')}</SubtextTypography>
                     </TransactionTableCompoundContainer>
                  ) : (
                     <TransactionTableCompoundContainer>
                        <TextTypography variant="body1">{'Data desconhecida'}</TextTypography>
                     </TransactionTableCompoundContainer>
                  )}
               </TransactionTableDateContainer>
               <RowGroupCardSub>
                  {list.map(id => (
                     <ContainerBox key={id}>
                        <CheckboxContainer>
                           <Checkbox
                              checked={selection.includes(id)}
                              onChange={updaters.selection(id)}
                              color="primary"
                              disabled={!!edit}
                           />
                        </CheckboxContainer>
                        {edit?.id === id ? (
                           <TransactionsTableEditEntry
                              original={metadata[id]!}
                              edit={edit}
                              selected={[id]}
                              setEditPartial={updaters.editPartial}
                              setStatePartial={setStatePartial}
                              fixed={fixed}
                           />
                        ) : (
                           <TransactionsTableViewEntry
                              transaction={metadata[id]!}
                              updateState={setStatePartial}
                              fixed={fixed}
                           />
                        )}
                     </ContainerBox>
                  ))}
               </RowGroupCardSub>
            </RowGroupCard>
         ))}
         <LoadMoreButton
            variant="outlined"
            size="large"
            onClick={updaters.loadMore}
            endIcon={<PlaylistAdd />}
            disabled={!more}
         >
            {translations[language].loadMore}
         </LoadMoreButton>
      </Section>
   );
};

const useSetPartialValue = <T,>(current: T, setValue: (t: T) => void) => {
   const ref = useRefToValue(current);
   const setPartial = useCallback(
      (update: Partial<T>) =>
         setValue({
            ...ref.current,
            ...update,
         }),
      [ref, setValue]
   );
   return [ref, setPartial] as const;
};

const useTableUpdateFunctions = (
   stateRef: React.MutableRefObject<TransactionsTableState>,
   setStatePartial: (state: Partial<TransactionsTableState>) => void,
   filterRef: React.MutableRefObject<TransactionsTableFilters>,
   setFiltersPartial: (state: Partial<TransactionsTableFilters>) => void
) =>
   useMemo(
      () => ({
         selection: (id: ID) => () => setStatePartial({ selection: flipListIncludes(id, stateRef.current.selection) }),
         selectionHeader: (ids: ID[]) => () =>
            setStatePartial({ selection: stateRef.current.selection.length > 0 ? [] : ids }),
         edit: (edit: EditTransactionState) => setStatePartial({ edit }),
         editPartial: (update: Partial<EditTransactionState> | null) =>
            setStatePartial({ edit: update ? { ...stateRef.current.edit, ...update } : undefined }),
         loadMore: () =>
            setFiltersPartial({
               tableLimit: filterRef.current.tableLimit + Math.min(100, filterRef.current.tableLimit),
            }),
      }),
      [stateRef, setStatePartial, filterRef, setFiltersPartial]
   );

const ActiveTableHeaderContainerSx = {
   boxShadow: CapybaraTheme.shadows[5],
};

const RowGroupCard = styled(Card)({
   marginTop: 20,
   borderRadius: '10px',
   padding: 0,
   background: 'transparent',
});

const RowGroupCardSub = styled(Card)({
   borderRadius: '10px',
   padding: 0,
   background: 'transparent',
});

const ContainerBox = styled('div')({
   ...TransactionTableSxProps.Container,
   color: '#fff',
   background: '#242020', //#080707", //linear-gradient(0deg, #67656a, #080707)",

   //'& > div:last-child': {
   //   visibility: 'hidden',
   //},
   //'&:hover > div:last-child': {
   //   visibility: 'inherit',
   //},
} as any);

const CheckboxContainer = styled('div')({
    ...TransactionTableSxProps.CenteredValueContainer,
    borderRadius: "50%",
    margin: "3px",
    "&:hover": {
        color: "#080707",
        background: "#fff",        
    }
});

const LoadMoreButton = styled(Button)({
   marginTop: 50,
   alignSelf: 'center',
});

const TextTypography = styled(Typography)({
   color: '#fff',
});

const SubtextTypography = styled(Typography)({
   color: '#67656a',
   alignSelf: 'flex-end',
   margin: '10px 4px 8px 4px',
   lineHeight: 1,
   width: '100%',
});
