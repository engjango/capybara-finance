import styled from '@emotion/styled';
import {
    AddCircleOutline,
    Exposure,
    IndeterminateCheckBox,
    List,
    PlaylistAdd,
    PlaylistAddCheck,
} from '@mui/icons-material';
import {
    IconButton,
    ListItem,
    ListItemText,
    Menu,
    ToggleButton,
    ToggleButtonGroup,
    Tooltip,
    Typography,
} from '@mui/material';
import React from 'react';
import { FilterIcon, TableHeaderContainer } from '../../../components/table';
import { createNewCategory } from '../../../dialog/objects/categories';
import { usePopoverProps } from '../../../shared/hooks';
import { CapybaraDispatch } from '../../../state';
import { AppSlice } from '../../../state/app';
import { CategoriesPageState, ChartSign } from '../../../state/app/pageTypes';
import {
    CategoriesTableActionBox,
    CategoriesTableFillbarSx,
    CategoriesTableIconSx,
    CategoriesTableMainSx,
    CategoriesTableSubtitleSx,
    CategoriesTableTitleBox,
    CategoriesTableTotalSx,
} from './styles';
import { useLanguage } from '../../../languages/languages-context';

const IconPlaceholderBox = styled('div')(CategoriesTableIconSx);
const TotalBox = styled('div')(CategoriesTableTotalSx);
const SubtitleBox = styled('div')(CategoriesTableSubtitleSx);
const ActionBox = styled(CategoriesTableActionBox)({ visibility: 'visible !important' as any });
const MainBox = styled('div')(CategoriesTableMainSx);
const FillbarBox = styled('div')({ ...CategoriesTableFillbarSx, display: 'flex', alignItems: 'center' });

export const CategoriesPageTableHeader: React.FC<Pick<CategoriesPageState, 'tableSign' | 'hideEmpty'>> = ({
    tableSign,
    hideEmpty,
}) => {
    const categoryPopover = usePopoverProps();
    const valuePopover = usePopoverProps();
    const { language, translations } = useLanguage();

    return (
        <TableHeaderContainer sx={{ padding: '0 10px' }}>
            <CategoriesTableTitleBox>
                <IconPlaceholderBox />
                <Typography variant="h6">{translations[language].category}</Typography>
                <FilterIcon
                    badgeContent={Number(tableSign !== 'all')}
                    ButtonProps={categoryPopover.buttonProps}
                    onRightClick={removeTableSign}
                />
                <Menu {...categoryPopover.popoverProps} PaperProps={{ style: { maxHeight: 300, width: 300 } }}>
                    <ListItem>
                        <ListItemText>{translations[language].categoryTypes}</ListItemText>
                        <ToggleButtonGroup size="small" value={tableSign} exclusive={true} onChange={onSetTableSign}>
                            <ToggleButton value="all">
                                <Tooltip title={translations[language].allCategories}>
                                    <Exposure fontSize="small" />
                                </Tooltip>
                            </ToggleButton>
                            <ToggleButton value="credits">
                                <Tooltip title={translations[language].incomeCategories}>
                                    <AddCircleOutline fontSize="small" />
                                </Tooltip>
                            </ToggleButton>
                            <ToggleButton value="debits">
                                <Tooltip title={translations[language].expenseCategories}>
                                    <IndeterminateCheckBox fontSize="small" />
                                </Tooltip>
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </ListItem>
                </Menu>
            </CategoriesTableTitleBox>
            <MainBox>
                <SubtitleBox />
                <FillbarBox>
                    <Typography variant="h6">{translations[language].valuesAndBudgets}</Typography>
                    <FilterIcon
                        badgeContent={Number(hideEmpty !== 'none')}
                        ButtonProps={valuePopover.buttonProps}
                        onRightClick={removeHideEmpty}
                    />
                    <Menu {...valuePopover.popoverProps} PaperProps={{ style: { maxHeight: 300, width: 300 } }}>
                        <ListItem>
                            <ListItemText>{translations[language].hideEmpty}</ListItemText>
                            <ToggleButtonGroup
                                size="small"
                                value={hideEmpty}
                                exclusive={true}
                                onChange={onSetHideEmpty}
                            >
                                <ToggleButton value="none">
                                    <Tooltip title={translations[language].showAllCategories}>
                                        <List fontSize="small" />
                                    </Tooltip>
                                </ToggleButton>
                                <ToggleButton value="subcategories">
                                    <Tooltip title={translations[language].hideEmptySubCategories}>
                                        <PlaylistAdd fontSize="small" />
                                    </Tooltip>
                                </ToggleButton>
                                <ToggleButton value="all">
                                    <Tooltip title={translations[language].hideAllEmptyCategories}>
                                        <PlaylistAddCheck fontSize="small" />
                                    </Tooltip>
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </ListItem>
                    </Menu>
                </FillbarBox>
                <TotalBox />
                <ActionBox>
                    <IconButton size="small" onClick={createNewCategory} style={{color: "#fff"}}>
                        <AddCircleOutline />
                    </IconButton>
                </ActionBox>
            </MainBox>
        </TableHeaderContainer>
    );
};

const removeTableSign = () => CapybaraDispatch(AppSlice.actions.setCategoriesPagePartial({ tableSign: 'all' }));
const onSetTableSign = (_: any, tableSign: ChartSign) =>
    CapybaraDispatch(AppSlice.actions.setCategoriesPagePartial({ tableSign }));

const removeHideEmpty = () => CapybaraDispatch(AppSlice.actions.setCategoriesPagePartial({ hideEmpty: 'none' }));
const onSetHideEmpty = (_: any, hideEmpty: CategoriesPageState['hideEmpty']) =>
    CapybaraDispatch(AppSlice.actions.setCategoriesPagePartial({ hideEmpty }));
