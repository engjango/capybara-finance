import styled from '@emotion/styled';
import { FileDownload, FileUpload } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import { Box, SxProps } from '@mui/system';
import chroma from 'chroma-js';
import { sortBy, sumBy } from 'lodash';
import React from 'react';
import { fadeSolidColour } from '../../../components/display/ObjectDisplay';
import { formatNumber, getChartDomainFunctions } from '../../../shared/data';
import { ID } from '../../../state/shared/values';
import { Greys } from '../../../styles/colours';
import { useLanguage } from '../../../languages/languages-context';

const BarContainerBox = styled('div')({
    display: 'flex',
    alignItems: 'center',
    padding: '10px 20px 0 10px',
    overflow: 'hidden',
});

const StackedBarBox = styled('div')({
    padding: '3px 0',
    borderLeft: '2px solid black',
    flexGrow: 1,
});

const ValueRowBox = styled('div')({
    height: 10,
    position: 'relative',
    marginLeft: -1,
    '& > *': { height: '100%', position: 'absolute' },
    '& > :first-of-type': { borderLeftColor: 'black' },
    '&:not(:last-child)': { marginBottom: 1 },
});

export interface CategoriesBarSummaryPoint {
    id: ID;
    name: string;
    colour: string;
    total: number;
    budget: number;
}
export const CategoriesBarSummary: React.FC<{ points: CategoriesBarSummaryPoint[] }> = ({ points }) => {
    const { language, translations } = useLanguage();
    const filtered = (key: 'total' | 'budget', type: 'credit' | 'debit') =>
        points.filter(point => (type === 'credit' ? point[key] > 0 : point[key] < 0));

    const functions = getChartDomainFunctions([
        sumBy(filtered('total', 'debit'), ({ total }) => Math.abs(total)),
        sumBy(filtered('budget', 'debit'), ({ budget }) => Math.abs(budget)),
        sumBy(filtered('total', 'credit'), ({ total }) => total),
        sumBy(filtered('budget', 'credit'), ({ budget }) => budget),
    ]);

    const getAllNodes = (key: 'total' | 'budget', type: 'credit' | 'debit', getSX: (colour: string) => SxProps) =>
        sortBy(filtered(key, type), ({ total }) => (type === 'credit' ? -total : total)).reduce(
            ({ nodes, acc }, point) => {
                const { offset: left, size: width } = functions.getOffsetAndSizeForRange(
                    acc,
                    acc + Math.abs(point[key])
                );
                const node = (
                    <Tooltip
                        key={point.id}
                        title={`${point.name}${key === 'budget' ? ` (${ translations[language].budget })` : ''}: ${formatNumber(point[key], {
                            end: 'k',
                        })}`}
                        disableInteractive={true}
                    >
                        <Box sx={{ left, width, ...getSX(point.colour) }} />
                    </Tooltip>
                );
                return { nodes: nodes.concat(node), acc: acc + Math.abs(point[key]) };
            },
            { nodes: [] as React.ReactNode[], acc: 0 }
        ).nodes;

    const getValueStyles = (colour: string) => ({
        background: fadeSolidColour(colour),
        border: '1px solid ' + colour,
    });

    const getBudgetStyles = (colour: string) => ({
        background: chroma(colour).alpha(0.2).hex(),
        border: '1px solid ' + chroma(colour).alpha(0.3).hex(),
    });
    
    const positiveValueNodes = getAllNodes('total', 'credit', getValueStyles);
    const positiveBudgetNodes = getAllNodes('budget', 'credit', getBudgetStyles);
    const negativeValueNodes = getAllNodes('total', 'debit', getValueStyles);
    const negativeBudgetNodes = getAllNodes('budget', 'debit', getBudgetStyles);    

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "stretch",
                background: "transparent",
                borderRadius: "8px",
                paddingBottom: 8,
                marginTop: 8,
                marginBottom: -6,
            }}
        >
            <BarContainerBox>
                <Tooltip title={ translations[language].incomes }>
                    <FileDownload fontSize="small" htmlColor={"green"} sx={{ marginRight: 8 }} />
                </Tooltip>
                <StackedBarBox>
                    <ValueRowBox>{positiveValueNodes}</ValueRowBox>
                    <ValueRowBox>{positiveBudgetNodes}</ValueRowBox>
                </StackedBarBox>
            </BarContainerBox>
            <BarContainerBox>
                <Tooltip title={ translations[language].expenses }>
                    <FileUpload fontSize="small" htmlColor={"red"} sx={{ marginRight: 8 }} />
                </Tooltip>
                <StackedBarBox>
                    <ValueRowBox>{negativeValueNodes}</ValueRowBox>
                    <ValueRowBox>{negativeBudgetNodes}</ValueRowBox>
                </StackedBarBox>
            </BarContainerBox>
        </Box>
    );
};
