import React, { useEffect } from 'react';
import { AccountPage } from '../pages/account';
import { AccountsPage } from '../pages/accounts';
import { CategoriesPage } from '../pages/categories';
import { CategoryPage } from '../pages/category';
import { ForecastPage } from '../pages/forecasts';
import { SummaryPage } from '../pages/summary';
import { TransactionsPage } from '../pages/transactions';
import { CapybaraDispatch } from '../state';
import { PageStateType } from '../state/app/pageTypes';
import { DataSlice, setSubmitNotification } from '../state/data';
import { useSelector } from '../state/shared/hooks';
import { NavBar } from './navbar';
import { useSetAlert } from './popups';
import Cursor from '../components/cursor';
import { useLanguage } from '../languages/languages-context';
import { X, /* RIP: Twitter,*/ Instagram, Facebook } from '@mui/icons-material';
import {
    AppContainerBox,
    FootNote,
    FootNoteContainer,
    FooterImage,
    SocialIcon,
    SocialIconsContainer,
} from '../styles/theme';

export const View: React.FC = () => {
    const page = useSelector(state => state.app.page.id);
    const setAlert = useSetAlert();
    const { language, translations } = useLanguage();

    useEffect(
        () =>
            setSubmitNotification((data, message, intent) =>
                setAlert({
                    message,
                    severity: intent || 'success',
                    action: {
                        name: translations[language].undo,
                        callback: () => CapybaraDispatch(DataSlice.actions.set(data)),
                    },
                })
            ),
        [setAlert]
    );

    return (
        <AppContainerBox>
            <NavBar />
            {Pages[page]}
            <Cursor isDesktop={true} />
            <FootNoteContainer>
                <FootNote style={{ fontSize: '1.3rem' }}>{translations[language].followUs}</FootNote>
                <SocialIconsContainer>
                    <SocialIcon href="https://instagram.com/engjango" target="_blank" arial-label="Facebook">
                        <Facebook />
                    </SocialIcon>
                    <SocialIcon href="https://instagram.com/engjango" target="_blank" arial-label="Instagram">
                        <Instagram />
                    </SocialIcon>
                    <SocialIcon href="https://instagram.com/engjango" target="_blank" arial-label="X">
                        <X />
                    </SocialIcon>
                </SocialIconsContainer>                
                <FooterImage src="/footer-curve.svg" alt="Footer curve" />
            </FootNoteContainer>
        </AppContainerBox>
    );
};

const Pages: Record<PageStateType['id'], JSX.Element> = {
    summary: <SummaryPage />,
    accounts: <AccountsPage />,
    account: <AccountPage />,
    transactions: <TransactionsPage />,
    categories: <CategoriesPage />,
    category: <CategoryPage />,
    forecasts: <ForecastPage />,
};
