import styled from '@emotion/styled';
import {
    AccountBalance,
    AccountBalanceWallet,
    CallSplit,
    Clear,
    Description,
    Euro,
    NoteAdd,
    Settings,
    ShoppingBasket,
} from '@mui/icons-material';
import {
    Divider,
    IconButton,
    ListItemIcon,
    ListItemText,
    MenuItem,
    outlinedInputClasses,
    Select,
    selectClasses,
} from '@mui/material';
import { handleSelectChange } from '../shared/events';
import { IconType } from '../shared/types';
import { CapybaraDispatch } from '../state';
import { AppSlice, DialogState } from '../state/app';
import { useDialogPage } from '../state/app/hooks';
import { DIALOG_OPTIONS_WIDTH } from './shared';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useLanguage } from '../languages/languages-context';

export const DialogHeader: React.FC = () => {
    const state = useDialogPage();
    const { language, translations } = useLanguage();

    const getMenuItem = (Icon: IconType, name: string, display: string) => (
        <MenuItem value={name} key={name}>
            <ListItemIcon>
                <Icon fontSize="small" htmlColor="#fff" />
            </ListItemIcon>
            <ExpandedListItemText>{display}</ExpandedListItemText>
        </MenuItem>
    );

    const MenuItems = [
        getMenuItem(AccountBalanceWallet, 'account', translations[language].accounts),
        getMenuItem(AccountBalance, 'institution', translations[language].institutions),
        getMenuItem(ShoppingBasket, 'category', translations[language].categories),
        getMenuItem(Euro, 'currency', translations[language].currencies),
        <Divider key={1} />,
        getMenuItem(Description, 'statement', translations[language].statements),
        getMenuItem(NoteAdd, 'import', translations[language].importStatement),
        getMenuItem(CallSplit, 'rule', translations[language].rules),
        <Divider key={2} />,
        getMenuItem(Settings, 'settings', translations[language].settings),
    ];

    return (
        <HeaderBox>
            <Select
                value={state !== 'closed' ? state : 'settings'}
                onChange={changeDialogScreen}
                size="small"
                // MenuProps={{ className: classes.menu }}
                style={{ color: '#fff' }}
                IconComponent={props => <ArrowDropDownIcon {...props} style={{ color: '#fff' }} />}
                MenuProps={{
                    PaperProps: {
                        style: {
                            color: '#fff',
                            backgroundColor: '#333',
                        },
                    },
                }}
            >
                {MenuItems}
            </Select>
            <CloseIconButton onClick={closeDialogBox} size="large" style={{ color: '#fff', border: '1px solid #fff' }}>
                <Clear fontSize="small" />
            </CloseIconButton>
        </HeaderBox>
    );
};

export const closeDialogBox = () => CapybaraDispatch(AppSlice.actions.setDialogPage('closed'));

const changeDialogScreen = handleSelectChange((id: DialogState['id']) => {
    CapybaraDispatch(AppSlice.actions.setDialogPage(id));
    setTimeout(() => (document.activeElement as HTMLElement | undefined)?.blur());
});

const ExpandedListItemText = styled(ListItemText)({ marginTop: '4px !important', marginBottom: '4px !important' });

const HeaderBox = styled('div')({
    color: '#fff',
    background: '#242020',
    height: 60,
    padding: '3px 8px 3px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,

    [`& .${outlinedInputClasses.root}:not(:hover):not(:focus-within) .${outlinedInputClasses.notchedOutline}`]: {
        border: 'none',
    },

    [`& .${selectClasses.select}`]: {
        width: DIALOG_OPTIONS_WIDTH - 32 - 18 - 20 * 2,
        display: 'flex',
        alignItems: 'center',
        padding: '5px 32px 5px 18px',
    },

    '@media screen and (max-width: 768px)': {
        borderBottom: '1px solid #67656a',
        [`& .${selectClasses.select}`]: {
            width: 'min-content',
        },
    },
});

const CloseIconButton = styled(IconButton)({
    margin: '8px',
});
