import styled from '@emotion/styled';
import { buttonBaseClasses, Card, Checkbox, Typography } from '@mui/material';
import { inRange, unzip } from 'lodash';
import React from 'react';
import { toggleAllStatementExclusions, toggleStatementExclusion } from '../../../../state/logic/statement';
import { useNonFileDialogStatementState } from '../shared';
import { DialogImportTableColumnHeader } from './header';
import { DIALOG_IMPORT_TABLE_HEADER_STYLES, DIALOG_IMPORT_TABLE_ROW_STYLES } from './shared';
import { DialogImportTableTransferDisplay } from './transfer';

export const FileImportTableView: React.FC<{ 
    transfers?: boolean; reversed?: boolean }> = ({ transfers, reversed }) => {
    const state = useNonFileDialogStatementState();

    const columns = state.columns.all[state.file].columns || [];

    const flipped =
        state.page === 'parse' || !state.mapping.value.flip
            ? undefined
            : columns.findIndex(
                  ({ id }) =>
                      (state.mapping.value.type === 'value' ? state.mapping.value.value : state.mapping.value.debit) ===
                      id
              );

    const rows = unzip(columns.map(column => column.values as (string | number | null)[]));
    if (reversed) rows.reverse();

    return (
        <ContainerCard variant="outlined">
            <GridBox
                style={{
                    gridTemplateColumns: `[start] 26px [content] repeat(${columns.length}, minmax(min-content, 1fr)) [end]`,
                }}
            >
                <CheckboxHeaderBox>
                    {state.page === 'import' ? (
                        <Checkbox
                            checked={state.exclude[state.file].length !== rows.length}
                            onClick={toggleAllStatementExclusions}
                            indeterminate={inRange(state.exclude[state.file].length, 1, rows.length)}
                            size="small"
                            color="primary"
                        />
                    ) : undefined}
                </CheckboxHeaderBox>
                {columns.map(column => (
                    <DialogImportTableColumnHeader column={column} state={state} key={column.id} />
                ))}
                {rows.map((row, rowID) => [
                    <CheckboxBox key={rowID}>
                        {state.page === 'import' ? (
                            <Checkbox
                                checked={!state.exclude[state.file].includes(rowID)}
                                onClick={toggleStatementExclusion(rowID)}
                                size="small"
                                color="default"
                            />
                        ) : undefined}
                    </CheckboxBox>,
                    row.map((value, columnID) => (
                        <ValueBox key={rowID + '_' + columnID}>
                            <Typography
                                variant="body2"
                                noWrap={true}
                                sx={{
                                    ...(columns[columnID]?.type === 'number' ? NumberDisplaySx : undefined),
                                    ...(state.page === 'import' && state.exclude[state.file].includes(rowID)
                                        ? ExcludedDisplaySx
                                        : undefined),
                                }}
                            >
                                {flipped === columnID ? -(value as number) : value}
                            </Typography>
                        </ValueBox>
                    )),
                    state.page === 'import' && state.transfers[state.file][rowID]?.transaction ? (
                        <DialogImportTableTransferDisplay
                            transfers={transfers}
                            disabled={state.exclude[state.file].includes(rowID)}
                            transfer={state.transfers[state.file][rowID]!}
                            file={state.file}
                            row={rowID}
                            key={rowID + '_transfer'}
                        />
                    ) : undefined,
                ])}
            </GridBox>
        </ContainerCard>
    );
};

const GridBox = styled('div')({
    margin: '10px 15px',
    overflow: 'auto',
    minHeight: 0,
    maxHeight: '100%',
    background: "#242020",

    display: 'grid',
    gridAutoRows: 'min-content',
});

const CheckboxHeaderBox = styled('div')({
    ...DIALOG_IMPORT_TABLE_HEADER_STYLES,
    display: 'flex',
    justifyContent: 'center',
    padding: '6px 0 22px 0',

    [`& > .${buttonBaseClasses.root}`]: {
        padding: 2,
    },
});

const ContainerCard = styled(Card)({
    background: "#67656a",
    margin: '20px 20px 0 20px',
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'stretch',
    height: "100vh",
});

const CheckboxBox = styled('div')({
    ...DIALOG_IMPORT_TABLE_ROW_STYLES,
    display: 'flex',
    justifyContent: 'center',
    border: "1px solid #67656a",

    [`& > .${buttonBaseClasses.root}`]: {
        padding: 2,
        transform: 'scale(0.8)',
        transformOrigin: 'center center',
    },
});
const ValueBox = styled('div')({
    maxWidth: 300,
    padding: '2px 20px 2px 10px',
    color: "#fff",
    border: "1px solid #67656a",
    ...DIALOG_IMPORT_TABLE_ROW_STYLES,
});

const NumberDisplaySx = { textAlign: 'right' as const };
const ExcludedDisplaySx = { opacity: 0.5 };
