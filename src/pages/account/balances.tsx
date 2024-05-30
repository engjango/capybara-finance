import { MenuItem, Select } from '@mui/material';
import { Box } from '@mui/system';
import { keys } from 'lodash';
import { useState } from 'react';
import { FlexWidthChart } from '../../components/display/FlexWidthChart';
import { Section } from '../../components/layout';
import { BalanceSnapshotSummaryNumbers, useAssetsSnapshot, useGetSummaryChart } from '../../components/snapshot';
import { handleSelectChange } from '../../shared/events';
import { useAccountPageAccount } from '../../state/app/hooks';
import { useCurrencyMap } from '../../state/data/hooks';
import { ID } from '../../state/shared/values';
import { useLanguage } from '../../languages/languages-context';
import styled from '@emotion/styled';

export const AccountPageBalances: React.FC = () => {
    const account = useAccountPageAccount();
    const currencies = useCurrencyMap();

    const [currency, setCurrency] = useState<ID | 'all'>('all');
    const onChangeCurrency = handleSelectChange((value: ID | 'all') =>
        setCurrency(value === 'all' ? 'all' : Number(value))
    );

    const balanceData = useAssetsSnapshot(account.id, currency === 'all' ? undefined : currency);
    const getChart = useGetSummaryChart(balanceData);

    const { language, translations } = useLanguage();

    return (
        <Section
            title={translations[language].balanceHistory}
            headers={
                <Select
                    value={currency}
                    onChange={onChangeCurrency}
                    size="small"
                    key="aggregation"
                    style={{ color: '#fff', background: '#242020' }}
                >
                    <MenuItem value="all">{translations[language].allCurrencies}</MenuItem>
                    {keys(account.balances).map(id => (
                        <MenuItem value={id} key={id}>
                            ({currencies[id]!.ticker}) {currencies[id]!.name}
                        </MenuItem>
                    ))}
                </Select>
            }
        >
            <BalanceContainerCard>
                <BalanceSnapshotSummaryNumbers data={balanceData} />
                <FlexWidthChart style={{ flexGrow: 1 }} getChart={getChart} />
            </BalanceContainerCard>
        </Section>
    );
};

const BalanceContainerCard = styled(Box)({
    display: 'grid',
    width: '100%',
    height: '100%',
});
