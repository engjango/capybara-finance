import { ChevronRight } from '@mui/icons-material';
import { Button } from '@mui/material';
import React from 'react';
import { Notifications } from '../../app/notifications';
import { FlexWidthChart } from '../../components/display/FlexWidthChart';
import { Page, Section } from '../../components/layout';
import {
    BalanceSnapshotSummaryNumbers,
    TransactionSnapshotSummaryNumbers,
    useAssetsSnapshot,
    useGetSummaryChart,
    useTransactionsSnapshot,
} from '../../components/snapshot';
import { OpenPageCache } from '../../state/app/actions';
import { PageStateType } from '../../state/app/pageTypes';
import { useLanguage } from '../../languages/languages-context';
import {
    ContainerBox,
    NotificationColumnSx,
    SummaryColumnBox,
    SummaryContainer,
    SummaryRowBox,
} from '../../styles/theme';

export const SummaryPage: React.FC = () => {
    const assetSummaryData = useAssetsSnapshot();
    const transactionSummaryData = useTransactionsSnapshot();
    const { language, translations } = useLanguage();
    const getAssetsChart = useGetSummaryChart(assetSummaryData);
    const getTransactionsChart = useGetSummaryChart(transactionSummaryData);

    const SeeMore: React.FC<{ page: PageStateType['id'] }> = ({ page }) => {
        const { language, translations } = useLanguage();
        return (
            <Button endIcon={<ChevronRight />} onClick={OpenPageCache[page]} size="small">
                {translations[language].seeMore}
            </Button>
        );
    };

    return (
        <Page title={translations[language].summary} hideButtons={true}>
            <ContainerBox>
                <SummaryColumnBox>
                    <Section title={translations[language].netWorth} headers={<SeeMore page="accounts" />}>
                        <SummaryContainer>
                            <BalanceSnapshotSummaryNumbers data={assetSummaryData} />
                        </SummaryContainer>
                    </Section>
                    <Section>
                        <SummaryContainer>
                            <FlexWidthChart style={{ flexGrow: 1 }} getChart={getAssetsChart} />
                        </SummaryContainer>
                    </Section>
                    <Section
                        title={translations[language].cashFlow}
                        headers={<SeeMore page="transactions" />}
                        sx={{ marginTop: '36px' }}
                    >
                        <SummaryContainer>
                            <TransactionSnapshotSummaryNumbers data={transactionSummaryData} />
                        </SummaryContainer>
                    </Section>
                    <Section>
                        <SummaryContainer>
                            <FlexWidthChart sx={{ flexGrow: 1 }} getChart={getTransactionsChart} />
                        </SummaryContainer>
                    </Section>
                </SummaryColumnBox>
            </ContainerBox>
            <ContainerBox>
                <SummaryRowBox>
                    <Section title={translations[language].notifications} sx={NotificationColumnSx}>
                        <Notifications />
                    </Section>
                </SummaryRowBox>
            </ContainerBox>
        </Page>
    );
};
