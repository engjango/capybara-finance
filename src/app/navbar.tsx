import styled from '@emotion/styled';
import {
    AccountBalanceWalletTwoTone,
    Camera,
    PaymentTwoTone,
    SettingsTwoTone,
    ShoppingBasketTwoTone,
    TrendingUpTwoTone,
    SignLanguageTwoTone,
    Pix,
} from '@mui/icons-material';
import { IconButton, Paper } from '@mui/material';
import chroma from 'chroma-js';
import { mapValues } from 'lodash-es';
import React, { useEffect, useState } from 'react';
import { IconType } from '../shared/types';
import { CapybaraDispatch } from '../state';
import { AppSlice, DefaultPages } from '../state/app';
import { OpenPageCache } from '../state/app/actions';
import { PageStateType } from '../state/app/pageTypes';
import { useSelector } from '../state/shared/hooks';
import { AppColours, WHITE } from '../styles/colours';
import { getThemeTransition } from '../styles/theme';
import { useLanguage } from '../languages/languages-context';

export const NAVBAR_LOGO_HEIGHT = 156;

const SelectionEquivalents = {
    ...mapValues(DefaultPages, page => page.id as 'summary'),
    account: 'accounts' as const,
    category: 'categories' as const,
    configs: 'configs' as const,
};

export const NavBar: React.FC = () => {
    const page = useSelector(state => state.app.page.id);
    const { language, translations, setLanguage } = useLanguage();

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'pt' : 'en');
    };

    const getIcon = (
        colour: string,
        Icon: IconType,
        onClick: (event: React.MouseEvent<HTMLButtonElement>) => void,
        selected: boolean = false,
        logo: boolean = false,
        text: string = ''
    ) => (
        <div
            style={{
                padding: '8px',
                //border: "1px solid pink",
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <AppIconButton
                sx={{
                    transition: getThemeTransition('all'),
                    color: selected ? WHITE : colour,
                    background: selected ? colour : chroma(colour).alpha(0.1).hex(),
                    '&:hover': {
                        backgroundColor: selected ? chroma(colour).darken(1).hex() : chroma(colour).alpha(0.2).hex(),
                    },
                }}
                onClick={onClick}
                size="large"
            >
                <Icon
                    sx={{
                        fontSize: logo ? '2rem' : '1.7rem',
                        transformOrigin: 'center',
                        transition: getThemeTransition('all'),
                    }}
                />
            </AppIconButton>
            <div style={{ marginLeft: '54px' }} />
            {/*text && false && <SubTextContainer style={{ color: selected ? WHITE : colour }}>{text}</SubTextContainer>*/}
        </div>
    );

    const getTab = (id: PageStateType['id'], Icon: IconType, logo: boolean = false) => {
        const selected = SelectionEquivalents[page] === id;
        const { main } = AppColours[SelectionEquivalents[id]];

        const getTranslatedType = (title: string) => {
            switch (title) {
                case 'summary':
                    return translations[language].summary;
                case 'accounts':
                    return translations[language].accounts;
                case 'transactions':
                    return translations[language].transactions;
                case 'categories':
                    return translations[language].categories;
                case 'forecasts':
                    return translations[language].forecasts;
                case 'configs':
                    return 'configs';
                default:
                    return title;
            }
        };

        return getIcon(main, Icon, OpenPageCache[id], selected, logo, getTranslatedType(id));
    };

    const [currentScrollTop, setCurrentScrollTop] = React.useState(-1);
    const [lastScrollTop, setLastScrollTop] = React.useState(-1);
    const [isVisible, setIsVisible] = React.useState(true);
    React.useEffect(() => {
        const handleScroll = () => {
            setCurrentScrollTop(window.pageYOffset || document.documentElement.scrollTop);
            setIsVisible(currentScrollTop < lastScrollTop || currentScrollTop === 0);
            setLastScrollTop(currentScrollTop <= 0 ? 0 : currentScrollTop);
        };

        window.addEventListener('scroll', handleScroll);
        // Cleanup do event listener ao desmontar o componente
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isVisible, lastScrollTop]);

    return (
        <NavBarContainerPaper isVisible={isVisible}>
            <SummaryContainerBox>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        //border: "1px solid grey",
                        padding: '8px',
                    }}
                >
                    <LogoContainer>
                        <img src={'/logo.png'} width={'100%'} />
                    </LogoContainer>
                    <SubTextContainer>
                        <h1
                            style={{
                                color: '#fff',
                                marginLeft: '16px',
                            }}
                        >
                            {translations[language].appName}
                        </h1>
                        {
                            <h3
                                style={{
                                    color: '#67656a',
                                    marginLeft: '16px',
                                    marginTop: '-12px',
                                    fontWeight: 'lighter',
                                }}
                            >
                                {translations[language].personalFinances}
                            </h3>
                        }
                    </SubTextContainer>
                </div>
            </SummaryContainerBox>
            <AppContainerBox>
                {getTab('summary', Pix, true)}
                {getTab('accounts', AccountBalanceWalletTwoTone)}
                {getTab('transactions', PaymentTwoTone)}
                {getTab('categories', ShoppingBasketTwoTone)}
                {getTab('forecasts', TrendingUpTwoTone)}
                {getIcon('#67656a', SettingsTwoTone, openSettingsDialog, false, false, translations[language].options)}
                {/*getIcon("#7000ff", SignLanguageTwoTone, toggleLanguage)*/}
            </AppContainerBox>
            {/*<SettingsContainerBox>{getIcon("#67656a", SettingsTwoTone, openSettingsDialog)}</SettingsContainerBox> */}
        </NavBarContainerPaper>
    );
};

const openSettingsDialog = () => CapybaraDispatch(AppSlice.actions.setDialogPage('settings'));

const LogoContainer = styled('div')({
    height: '100%',
    //border: "1px solid white",
    width: '100px',
    WebkitTransform: 'scaleX(-1)',
    MozTransform: 'scaleX(-1)',
    OTransform: 'scaleX(-1)',
    transform: 'scaleX(-1)',
    '@media screen and (max-width: 1024px)': {
        display: 'none',
    },
});

const SubTextContainer = styled('div')({
    '@media screen and (max-width: 1024px)': {
        display: 'none',
    },
});

const AppIconButton = styled(IconButton)({
    width: '46px',
    height: '46px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // border: "1px solid",
    borderRadius: '10px',
    marginBottom: '4px',
    flexShrink: 0,
});

const NavBarContainerPaper = styled(Paper)<{ isVisible: boolean }>(({ isVisible }) => ({
    //border: "1px solid red",
    height: '100%',
    width: '100%',
    //flex: "80px 0 0",
    display: 'flex',
    alignSelf: 'center',
    flexDirection: 'row',
    //alignItems: "stretch",
    transition: 'transform .3s ease-in-out',
    //position: "fixed",
    //padding: "16px",
    //background: "#080707",
    background: 'linear-gradient(0deg, rgba(18,14,22,1), black)',
    maxWidth: '1280px',

    '& > div': {
        //padding: "16px",
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        //border: "1px solid blue",

        '& > div': {
            cursor: 'pointer',
        },
    },

    '@media screen and (max-width: 1024px)': {
        padding: '16px',
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        flexDirection: 'row',
        zIndex: 50,
        alignItems: 'center',
        height: '80px',
        '& > div': {
            flexDirection: 'row',
            justifyContent: 'space-around',
        },
        transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
    },
}));

const SummaryContainerBox = styled('div')({
    height: NAVBAR_LOGO_HEIGHT,
    justifyContent: 'center',
    flexShrink: 0,

    '& > button': {
        margin: 0,
        borderRadius: '50%',
        width: 52,
        height: 52,

        svg: {
            strokeWidth: 1,
        },
    },
});

const AppContainerBox = styled('div')({
    flexGrow: 1,
    flexShrink: 1,
    minHeight: 0,
    overflowY: 'auto',

    '@media screen and (max-width: 1024px)': {
        //paddingTop: "26px",
    },
});

const SettingsContainerBox = styled('div')({
    flexShrink: 0,
    background: WHITE,
    paddingTop: 27,
    '& > *:last-child': { marginBottom: 13 },
});
